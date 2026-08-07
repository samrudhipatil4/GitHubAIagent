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
import { requireAuth, attachAccessToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, attachAccessToken);

router.get('/search', searchRepos);
router.get('/', listRepositories);

router.get('/:owner/:repo/pulls', listPullRequests);
router.get('/:owner/:repo/pulls/:number/files', getPullRequestFilesList);
router.get('/:owner/:repo/pulls/:number/comments', getPullRequestCommentsList);
router.put('/:owner/:repo/pulls/:number/merge', mergePullRequestHandler);
router.get('/:owner/:repo/pulls/:number', getPullRequestDetails);

router.get('/:owner/:repo/stats', getRepoStats);
router.get('/:owner/:repo/contributors', getRepoContributors);
router.get('/:owner/:repo', getRepoDetails);

export default router;
