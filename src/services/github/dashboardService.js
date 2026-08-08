import { githubRequest } from './githubClient.js';
import { getRepositories } from './repositoryService.js';

export const getDashboardStats = async (accessToken, login) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateStr = sevenDaysAgo.toISOString().split('T')[0];

  const [openPRsRes, openIssuesRes, repos] = await Promise.all([
    githubRequest(accessToken, (client) =>
      client.get('/search/issues', {
        params: { q: `is:open is:pr user:${login}`, per_page: 1 },
      })
    ),
    githubRequest(accessToken, (client) =>
      client.get('/search/issues', {
        params: { q: `is:open is:issue user:${login}`, per_page: 1 },
      })
    ),
    getRepositories(accessToken, { page: 1, perPage: 5 }),
  ]);

  let recentCommits = 0;
  await Promise.all(
    repos.slice(0, 3).map(async (repo) => {
      try {
        const [owner, name] = repo.fullName.split('/');
        const { data } = await githubRequest(accessToken, (client) =>
          client.get(`/repos/${owner}/${name}/commits`, {
            params: { since: `${dateStr}T00:00:00Z`, per_page: 100 },
          })
        );
        recentCommits += data.length;
      } catch {
        // skip repos we can't access
      }
    })
  );

  return {
    openPRs: openPRsRes.data.total_count,
    openIssues: openIssuesRes.data.total_count,
    recentCommits,
  };
};
