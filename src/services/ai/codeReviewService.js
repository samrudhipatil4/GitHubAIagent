import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import {
  CODE_REVIEW_SYSTEM_PROMPT,
  buildFileReviewPrompt,
  buildSummaryPrompt,
} from '../../prompts/codeReviewPrompt.js';
import { getPullRequest, getPullRequestFiles } from '../github/pullRequestService.js';

const reviewCache = new Map();

const cacheKey = (owner, repo, number) => `${owner}/${repo}#${number}`;

const parseJsonResponse = (text) => {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new AppError('Failed to parse AI review response', 502);
  }
};

const callGeminiJson = async (prompt, systemPrompt = CODE_REVIEW_SYSTEM_PROMPT) => {
  if (!env.GEMINI_API_KEY) {
    throw new AppError('GEMINI_API_KEY is not configured', 503);
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: env.AI_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const result = await model.generateContent(prompt);
  return parseJsonResponse(result.response.text());
};

export const analyzeFile = async (filename, patch, prTitle) => {
  if (!patch || patch.length === 0) {
    return { filename, issues: [] };
  }

  const prompt = buildFileReviewPrompt(filename, patch, prTitle);
  const data = await callGeminiJson(prompt);

  return {
    filename,
    issues: (data.issues || []).map((issue) => ({
      type: issue.type || 'codeQuality',
      severity: issue.severity || 'medium',
      line: issue.line || null,
      message: issue.message || '',
      suggestion: issue.suggestion || '',
    })),
  };
};

const countCategories = (files) => {
  const categories = { bugs: 0, security: 0, performance: 0, codeQuality: 0 };

  for (const file of files) {
    for (const issue of file.issues) {
      if (issue.type === 'bug') categories.bugs++;
      else if (issue.type === 'security') categories.security++;
      else if (issue.type === 'performance') categories.performance++;
      else categories.codeQuality++;
    }
  }

  return categories;
};

const calculateScore = (files) => {
  let score = 100;
  const deductions = { high: 10, medium: 5, low: 2 };

  for (const file of files) {
    for (const issue of file.issues) {
      score -= deductions[issue.severity] || 5;
    }
  }

  return Math.max(0, Math.min(100, score));
};

export const generateSummary = async (prTitle, prBody, fileReviews) => {
  const prompt = buildSummaryPrompt(prTitle, prBody, fileReviews);
  const data = await callGeminiJson(prompt);

  return {
    summary: data.summary || 'Review completed.',
    overallScore: data.overallScore ?? calculateScore(fileReviews),
    recommendation: data.recommendation || 'comment',
  };
};

export const reviewPullRequest = async (accessToken, owner, repo, number) => {
  const key = cacheKey(owner, repo, number);

  const [pullRequest, files] = await Promise.all([
    getPullRequest(accessToken, owner, repo, number),
    getPullRequestFiles(accessToken, owner, repo, number),
  ]);

  const reviewableFiles = files.filter((f) => f.patch && f.status !== 'removed').slice(0, 10);

  const fileReviews = [];
  for (const file of reviewableFiles) {
    const review = await analyzeFile(file.filename, file.patch, pullRequest.title);
    fileReviews.push(review);
  }

  const categories = countCategories(fileReviews);
  const aiSummary = await generateSummary(pullRequest.title, pullRequest.body, fileReviews);

  const review = {
    pullRequest: {
      number: pullRequest.number,
      title: pullRequest.title,
      htmlUrl: pullRequest.htmlUrl,
    },
    overallScore: aiSummary.overallScore ?? calculateScore(fileReviews),
    summary: aiSummary.summary,
    recommendation: aiSummary.recommendation,
    files: fileReviews,
    categories,
    reviewedAt: new Date().toISOString(),
    filesAnalyzed: fileReviews.length,
    totalFiles: files.length,
  };

  reviewCache.set(key, review);
  return review;
};

export const getCachedReview = (owner, repo, number) => {
  const key = cacheKey(owner, repo, number);
  return reviewCache.get(key) || null;
};
