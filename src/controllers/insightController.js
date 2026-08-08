import {
  summarizeRepository,
  explainRepository,
  generateReadme,
  explainFolderStructure,
  explainPackageJson,
  explainDockerfile,
  getLanguageStats,
  getContributorStats,
  getCommitActivity,
  getIssuePRStats,
  getFullInsights,
} from '../services/ai/repositoryInsightService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getSummary = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const result = await summarizeRepository(req.accessToken, owner, repo);
    return successResponse(res, 'Repository summary generated', result);
  } catch (error) {
    next(error);
  }
};

export const getExplain = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const result = await explainRepository(req.accessToken, owner, repo);
    return successResponse(res, 'Repository explanation generated', result);
  } catch (error) {
    next(error);
  }
};

export const postReadme = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const result = await generateReadme(req.accessToken, owner, repo);
    return successResponse(res, 'README generated', result);
  } catch (error) {
    next(error);
  }
};

export const getStructure = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const result = await explainFolderStructure(req.accessToken, owner, repo);
    return successResponse(res, 'Structure explanation generated', result);
  } catch (error) {
    next(error);
  }
};

export const getPackageJson = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const result = await explainPackageJson(req.accessToken, owner, repo);
    return successResponse(res, 'package.json explained', result);
  } catch (error) {
    next(error);
  }
};

export const getDockerfile = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const result = await explainDockerfile(req.accessToken, owner, repo);
    return successResponse(res, 'Dockerfile explained', result);
  } catch (error) {
    next(error);
  }
};

export const getLanguages = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const languages = await getLanguageStats(req.accessToken, owner, repo);
    return successResponse(res, 'Language stats retrieved', { languages });
  } catch (error) {
    next(error);
  }
};

export const getContributorsInsight = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const contributors = await getContributorStats(req.accessToken, owner, repo);
    return successResponse(res, 'Contributors retrieved', { contributors });
  } catch (error) {
    next(error);
  }
};

export const getActivity = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const activity = await getCommitActivity(req.accessToken, owner, repo);
    return successResponse(res, 'Commit activity retrieved', { activity });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const stats = await getIssuePRStats(req.accessToken, owner, repo);
    return successResponse(res, 'Issue/PR stats retrieved', { stats });
  } catch (error) {
    next(error);
  }
};

export const getAllInsights = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const insights = await getFullInsights(req.accessToken, owner, repo);
    return successResponse(res, 'Insights retrieved', { insights });
  } catch (error) {
    next(error);
  }
};
