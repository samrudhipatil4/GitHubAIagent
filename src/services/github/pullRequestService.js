import { githubRequest } from './githubClient.js';

const formatLabel = (label) => ({
  name: label.name,
  color: label.color,
});

const formatUser = (user) => ({
  login: user.login,
  avatarUrl: user.avatar_url,
  profileUrl: user.html_url,
});

const formatPullRequest = (pr) => ({
  id: pr.id,
  number: pr.number,
  title: pr.title,
  body: pr.body,
  state: pr.state,
  merged: Boolean(pr.merged_at),
  mergedAt: pr.merged_at,
  createdAt: pr.created_at,
  updatedAt: pr.updated_at,
  closedAt: pr.closed_at,
  htmlUrl: pr.html_url,
  draft: pr.draft,
  mergeable: pr.mergeable,
  mergeableState: pr.mergeable_state,
  head: {
    ref: pr.head.ref,
    sha: pr.head.sha,
  },
  base: {
    ref: pr.base.ref,
    sha: pr.base.sha,
  },
  author: formatUser(pr.user),
  labels: (pr.labels || []).map(formatLabel),
  additions: pr.additions,
  deletions: pr.deletions,
  changedFiles: pr.changed_files,
  comments: pr.comments,
  commits: pr.commits,
});

export const getPullRequests = async (accessToken, owner, repo, { state = 'open', page = 1, perPage = 30 } = {}) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/pulls`, {
      params: { state, page, per_page: perPage, sort: 'updated', direction: 'desc' },
    })
  );

  return data.map(formatPullRequest);
};

export const getPullRequest = async (accessToken, owner, repo, number) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/pulls/${number}`)
  );

  return formatPullRequest(data);
};

export const getPullRequestFiles = async (accessToken, owner, repo, number) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/pulls/${number}/files`, {
      params: { per_page: 100 },
    })
  );

  return data.map((file) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
    patch: file.patch,
    previousFilename: file.previous_filename,
  }));
};

export const getPullRequestComments = async (accessToken, owner, repo, number) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/pulls/${number}/comments`, {
      params: { per_page: 100 },
    })
  );

  return data.map((comment) => ({
    id: comment.id,
    body: comment.body,
    path: comment.path,
    line: comment.line,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    htmlUrl: comment.html_url,
    author: formatUser(comment.user),
  }));
};

export const mergePullRequest = async (accessToken, owner, repo, number, { commitTitle, commitMessage, mergeMethod = 'merge' } = {}) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.put(`/repos/${owner}/${repo}/pulls/${number}/merge`, {
      commit_title: commitTitle,
      commit_message: commitMessage,
      merge_method: mergeMethod,
    })
  );

  return {
    merged: data.merged,
    message: data.message,
    sha: data.sha,
  };
};

export const createPullRequestReview = async (accessToken, owner, repo, number, { body, event = 'COMMENT' }) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.post(`/repos/${owner}/${repo}/pulls/${number}/reviews`, {
      body,
      event,
    })
  );

  return {
    id: data.id,
    state: data.state,
    body: data.body,
    htmlUrl: data.html_url,
  };
};
