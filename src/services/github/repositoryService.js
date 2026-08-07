import { githubRequest } from './githubClient.js';

const formatRepo = (repo) => ({
  id: repo.id,
  name: repo.name,
  fullName: repo.full_name,
  description: repo.description,
  language: repo.language,
  stars: repo.stargazers_count,
  forks: repo.forks_count,
  watchers: repo.watchers_count,
  openIssues: repo.open_issues_count,
  isPrivate: repo.private,
  defaultBranch: repo.default_branch,
  htmlUrl: repo.html_url,
  cloneUrl: repo.clone_url,
  createdAt: repo.created_at,
  updatedAt: repo.updated_at,
  pushedAt: repo.pushed_at,
  owner: {
    login: repo.owner.login,
    avatarUrl: repo.owner.avatar_url,
  },
});

export const getRepositories = async (accessToken, { page = 1, perPage = 30, sort = 'updated' } = {}) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get('/user/repos', {
      params: {
        page,
        per_page: perPage,
        sort,
        affiliation: 'owner,collaborator,organization_member',
      },
    })
  );

  return data.map(formatRepo);
};

export const getRepository = async (accessToken, owner, repo) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}`)
  );

  return formatRepo(data);
};

export const searchRepositories = async (accessToken, query, { page = 1, perPage = 30 } = {}) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get('/search/repositories', {
      params: { q: query, page, per_page: perPage, sort: 'updated' },
    })
  );

  return {
    totalCount: data.total_count,
    items: data.items.map(formatRepo),
  };
};

export const getRepositoryStats = async (accessToken, owner, repo) => {
  const [repoRes, langRes] = await githubRequest(accessToken, (client) =>
    Promise.all([
      client.get(`/repos/${owner}/${repo}`),
      client.get(`/repos/${owner}/${repo}/languages`),
    ])
  );

  const repoData = repoRes.data;
  const languages = langRes.data;

  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  const languageBreakdown = Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes ? Math.round((bytes / totalBytes) * 100) : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  return {
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    watchers: repoData.watchers_count,
    openIssues: repoData.open_issues_count,
    size: repoData.size,
    defaultBranch: repoData.default_branch,
    languages: languageBreakdown,
  };
};

export const getContributors = async (accessToken, owner, repo) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/contributors`, {
      params: { per_page: 30 },
    })
  );

  return data.map((contributor) => ({
    id: contributor.id,
    login: contributor.login,
    avatarUrl: contributor.avatar_url,
    profileUrl: contributor.html_url,
    contributions: contributor.contributions,
  }));
};
