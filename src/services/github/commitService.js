import { githubRequest } from './githubClient.js';

const formatUser = (user) => ({
  login: user?.login,
  avatarUrl: user?.avatar_url,
  profileUrl: user?.html_url,
});

const formatCommit = (commit) => ({
  sha: commit.sha,
  message: commit.commit.message,
  author: {
    name: commit.commit.author.name,
    email: commit.commit.author.email,
    date: commit.commit.author.date,
    login: commit.author?.login,
    avatarUrl: commit.author?.avatar_url,
  },
  committer: {
    name: commit.commit.committer.name,
    date: commit.commit.committer.date,
  },
  htmlUrl: commit.html_url,
  commentsCount: commit.commit.comment_count,
});

export const getCommits = async (accessToken, owner, repo, { sha, page = 1, perPage = 30 } = {}) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/commits`, {
      params: { sha, page, per_page: perPage },
    })
  );

  return data.map(formatCommit);
};

export const getCommit = async (accessToken, owner, repo, commitSha) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/commits/${commitSha}`)
  );

  return {
    ...formatCommit(data),
    stats: data.stats,
    files: (data.files || []).map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch,
    })),
    parents: data.parents.map((p) => p.sha),
  };
};

export const compareCommits = async (accessToken, owner, repo, base, head) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/compare/${base}...${head}`)
  );

  return {
    status: data.status,
    aheadBy: data.ahead_by,
    behindBy: data.behind_by,
    totalCommits: data.total_commits,
    commits: data.commits.map(formatCommit),
    files: (data.files || []).map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch,
    })),
  };
};
