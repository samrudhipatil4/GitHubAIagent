import { githubRequest } from '../github/githubClient.js';
import { callGeminiText } from './geminiHelper.js';
import {
  INSIGHT_SYSTEM_PROMPT,
  buildSummaryPrompt,
  buildExplainPrompt,
  buildReadmePrompt,
  buildStructurePrompt,
  buildPackageJsonPrompt,
  buildDockerfilePrompt,
} from '../../prompts/insightPrompt.js';
import { getRepository, getRepositoryStats, getContributors } from '../github/repositoryService.js';
import { getIssues } from '../github/issueService.js';
import { getPullRequests } from '../github/pullRequestService.js';
import { AppError } from '../../utils/AppError.js';

const getFileContent = async (accessToken, owner, repo, path) => {
  try {
    const { data } = await githubRequest(accessToken, (client) =>
      client.get(`/repos/${owner}/${repo}/contents/${path}`)
    );
    if (Array.isArray(data) || !data.content) return null;
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch {
    return null;
  }
};

const getRepoTree = async (accessToken, owner, repo, branch) => {
  try {
    const { data: refData } = await githubRequest(accessToken, (client) =>
      client.get(`/repos/${owner}/${repo}/git/ref/heads/${branch}`)
    );
    const sha = refData.object.sha;

    const { data: treeData } = await githubRequest(accessToken, (client) =>
      client.get(`/repos/${owner}/${repo}/git/trees/${sha}`, {
        params: { recursive: '1' },
      })
    );

    return (treeData.tree || [])
      .filter((item) => item.path.split('/').length <= 3)
      .slice(0, 100)
      .map((item) => ({ path: item.path, type: item.type }));
  } catch {
    return [];
  }
};

export const getLanguageStats = async (accessToken, owner, repo) => {
  const stats = await getRepositoryStats(accessToken, owner, repo);
  return stats.languages;
};

export const getContributorStats = async (accessToken, owner, repo) => {
  return getContributors(accessToken, owner, repo);
};

export const getCommitActivity = async (accessToken, owner, repo) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/stats/commit_activity`)
  );

  return data.map((week) => ({
    week: week.week,
    total: week.total,
    days: week.days,
  }));
};

export const getIssuePRStats = async (accessToken, owner, repo) => {
  const [openIssues, closedIssues, openPRs, closedPRs] = await Promise.all([
    getIssues(accessToken, owner, repo, { state: 'open' }),
    getIssues(accessToken, owner, repo, { state: 'closed' }),
    getPullRequests(accessToken, owner, repo, { state: 'open' }),
    getPullRequests(accessToken, owner, repo, { state: 'closed' }),
  ]);

  return {
    issues: { open: openIssues.length, closed: closedIssues.length },
    pullRequests: { open: openPRs.length, closed: closedPRs.length },
  };
};

export const summarizeRepository = async (accessToken, owner, repo) => {
  const [repository, stats] = await Promise.all([
    getRepository(accessToken, owner, repo),
    getRepositoryStats(accessToken, owner, repo),
  ]);

  const summary = await callGeminiText(
    buildSummaryPrompt(repository, stats),
    INSIGHT_SYSTEM_PROMPT
  );

  return { summary, repository: { fullName: repository.fullName, htmlUrl: repository.htmlUrl } };
};

export const explainRepository = async (accessToken, owner, repo) => {
  const repository = await getRepository(accessToken, owner, repo);
  const [tree, readme] = await Promise.all([
    getRepoTree(accessToken, owner, repo, repository.defaultBranch),
    getFileContent(accessToken, owner, repo, 'README.md'),
  ]);

  const explanation = await callGeminiText(
    buildExplainPrompt(repository, tree, readme),
    INSIGHT_SYSTEM_PROMPT
  );

  return { explanation };
};

export const generateReadme = async (accessToken, owner, repo) => {
  const repository = await getRepository(accessToken, owner, repo);
  const [tree, existingReadme] = await Promise.all([
    getRepoTree(accessToken, owner, repo, repository.defaultBranch),
    getFileContent(accessToken, owner, repo, 'README.md'),
  ]);

  const readme = await callGeminiText(
    buildReadmePrompt(repository, tree, existingReadme),
    INSIGHT_SYSTEM_PROMPT
  );

  return { readme: readme.replace(/^```markdown\n?|\n?```$/g, '').trim() };
};

export const explainFolderStructure = async (accessToken, owner, repo) => {
  const repository = await getRepository(accessToken, owner, repo);
  const tree = await getRepoTree(accessToken, owner, repo, repository.defaultBranch);

  if (tree.length === 0) {
    throw new AppError('Could not fetch repository structure', 404);
  }

  const explanation = await callGeminiText(
    buildStructurePrompt(tree),
    INSIGHT_SYSTEM_PROMPT
  );

  return { structure: tree, explanation };
};

export const explainPackageJson = async (accessToken, owner, repo) => {
  const content = await getFileContent(accessToken, owner, repo, 'package.json');

  if (!content) {
    throw new AppError('package.json not found in this repository', 404);
  }

  const explanation = await callGeminiText(
    buildPackageJsonPrompt(content),
    INSIGHT_SYSTEM_PROMPT
  );

  return { explanation, hasPackageJson: true };
};

export const explainDockerfile = async (accessToken, owner, repo) => {
  const content = await getFileContent(accessToken, owner, repo, 'Dockerfile');

  if (!content) {
    throw new AppError('Dockerfile not found in this repository', 404);
  }

  const explanation = await callGeminiText(
    buildDockerfilePrompt(content),
    INSIGHT_SYSTEM_PROMPT
  );

  return { explanation, hasDockerfile: true };
};

export const getFullInsights = async (accessToken, owner, repo) => {
  const [repository, stats, contributors, activity, issuePRStats] = await Promise.all([
    getRepository(accessToken, owner, repo),
    getRepositoryStats(accessToken, owner, repo),
    getContributors(accessToken, owner, repo),
    getCommitActivity(accessToken, owner, repo).catch(() => []),
    getIssuePRStats(accessToken, owner, repo),
  ]);

  let summary = null;
  try {
    const result = await summarizeRepository(accessToken, owner, repo);
    summary = result.summary;
  } catch {
    summary = repository.description || 'Summary unavailable — check GEMINI_API_KEY.';
  }

  return {
    repository,
    summary,
    languages: stats.languages,
    contributors,
    activity,
    issuePRStats,
  };
};
