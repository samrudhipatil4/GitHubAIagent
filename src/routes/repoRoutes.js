import { Router } from 'express';
import {
  listRepositories,
  searchRepos,
  getRepoDetails,
  getRepoStats,
  getRepoContributors,
} from '../controllers/repositoryController.js';
import {
  listPullRequests,
  getPullRequestDetails,
  getPullRequestFilesList,
  getPullRequestCommentsList,
  mergePullRequestHandler,
} from '../controllers/pullRequestController.js';
import {
  listIssues,
  getIssueDetails,
  listLabels,
  listCollaborators,
  createIssueHandler,
  updateIssueHandler,
  closeIssueHandler,
  addCommentHandler,
} from '../controllers/issueController.js';
import {
  listCommits,
  getCommitDetails,
  compareBranches,
} from '../controllers/commitController.js';
import {
  listBranchesHandler,
  getBranchDetails,
  createBranchHandler,
  deleteBranchHandler,
} from '../controllers/branchController.js';
import {
  createReview,
  getReview,
} from '../controllers/codeReviewController.js';
import {
  getSummary,
  getExplain,
  postReadme,
  getStructure,
  getPackageJson,
  getDockerfile,
  getLanguages,
  getContributorsInsight,
  getActivity,
  getStats,
  getAllInsights,
} from '../controllers/insightController.js';
import {
  listRuns,
  getRun,
  getFailed,
  getDeployment,
  rerunRun,
  explainFailure,
} from '../controllers/actionsController.js';
import { requireAuth, attachAccessToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, attachAccessToken);

router.get('/search', searchRepos);
router.get('/', listRepositories);

router.get('/:owner/:repo/pulls', listPullRequests);
router.get('/:owner/:repo/pulls/:number/files', getPullRequestFilesList);
router.get('/:owner/:repo/pulls/:number/comments', getPullRequestCommentsList);
router.post('/:owner/:repo/pulls/:number/review', createReview);
router.get('/:owner/:repo/pulls/:number/review', getReview);
router.put('/:owner/:repo/pulls/:number/merge', mergePullRequestHandler);
router.get('/:owner/:repo/pulls/:number', getPullRequestDetails);

router.get('/:owner/:repo/issues', listIssues);
router.post('/:owner/:repo/issues', createIssueHandler);
router.get('/:owner/:repo/issues/labels', listLabels);
router.get('/:owner/:repo/issues/collaborators', listCollaborators);
router.get('/:owner/:repo/issues/:number', getIssueDetails);
router.patch('/:owner/:repo/issues/:number', updateIssueHandler);
router.post('/:owner/:repo/issues/:number/close', closeIssueHandler);
router.post('/:owner/:repo/issues/:number/comments', addCommentHandler);

router.get('/:owner/:repo/commits', listCommits);
router.get('/:owner/:repo/commits/:sha', getCommitDetails);
router.get('/:owner/:repo/compare', compareBranches);
router.get('/:owner/:repo/branches', listBranchesHandler);
router.post('/:owner/:repo/branches', createBranchHandler);
router.get('/:owner/:repo/branches/:branch', getBranchDetails);
router.delete('/:owner/:repo/branches/:branch', deleteBranchHandler);

router.get('/:owner/:repo/insights', getAllInsights);
router.get('/:owner/:repo/insights/summary', getSummary);
router.get('/:owner/:repo/insights/explain', getExplain);
router.post('/:owner/:repo/insights/readme', postReadme);
router.get('/:owner/:repo/insights/structure', getStructure);
router.get('/:owner/:repo/insights/package-json', getPackageJson);
router.get('/:owner/:repo/insights/dockerfile', getDockerfile);
router.get('/:owner/:repo/insights/languages', getLanguages);
router.get('/:owner/:repo/insights/contributors', getContributorsInsight);
router.get('/:owner/:repo/insights/activity', getActivity);
router.get('/:owner/:repo/insights/stats', getStats);

router.get('/:owner/:repo/actions/runs', listRuns);
router.get('/:owner/:repo/actions/runs/failed', getFailed);
router.get('/:owner/:repo/actions/deployment', getDeployment);
router.get('/:owner/:repo/actions/runs/:runId', getRun);
router.post('/:owner/:repo/actions/runs/:runId/rerun', rerunRun);
router.get('/:owner/:repo/actions/runs/:runId/explain', explainFailure);

router.get('/:owner/:repo/stats', getRepoStats);
router.get('/:owner/:repo/contributors', getRepoContributors);
router.get('/:owner/:repo', getRepoDetails);

export default router;
