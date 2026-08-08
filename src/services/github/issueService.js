import { githubRequest } from './githubClient.js';

const formatLabel = (label) => ({
  name: label.name,
  color: label.color,
  description: label.description,
});

const formatUser = (user) => ({
  login: user?.login,
  avatarUrl: user?.avatar_url,
  profileUrl: user?.html_url,
});

const formatIssue = (issue) => ({
  id: issue.id,
  number: issue.number,
  title: issue.title,
  body: issue.body,
  state: issue.state,
  stateReason: issue.state_reason,
  createdAt: issue.created_at,
  updatedAt: issue.updated_at,
  closedAt: issue.closed_at,
  htmlUrl: issue.html_url,
  author: formatUser(issue.user),
  labels: (issue.labels || []).map(formatLabel),
  assignees: (issue.assignees || []).map(formatUser),
  comments: issue.comments,
  isPullRequest: Boolean(issue.pull_request),
});

const formatComment = (comment) => ({
  id: comment.id,
  body: comment.body,
  createdAt: comment.created_at,
  updatedAt: comment.updated_at,
  htmlUrl: comment.html_url,
  author: formatUser(comment.user),
});

export const getIssues = async (accessToken, owner, repo, { state = 'open', page = 1, perPage = 30 } = {}) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/issues`, {
      params: { state, page, per_page: perPage, sort: 'updated', direction: 'desc' },
    })
  );

  return data.filter((issue) => !issue.pull_request).map(formatIssue);
};

export const getIssue = async (accessToken, owner, repo, number) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/issues/${number}`)
  );

  return formatIssue(data);
};

export const getIssueComments = async (accessToken, owner, repo, number) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/issues/${number}/comments`, {
      params: { per_page: 100 },
    })
  );

  return data.map(formatComment);
};

export const getLabels = async (accessToken, owner, repo) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/labels`, {
      params: { per_page: 100 },
    })
  );

  return data.map(formatLabel);
};

export const getCollaborators = async (accessToken, owner, repo) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/collaborators`, {
      params: { per_page: 100 },
    })
  );

  return data.map((user) => formatUser(user));
};

export const createIssue = async (accessToken, owner, repo, { title, body, labels, assignees }) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.post(`/repos/${owner}/${repo}/issues`, {
      title,
      body,
      labels,
      assignees,
    })
  );

  return formatIssue(data);
};

export const updateIssue = async (accessToken, owner, repo, number, { title, body, state, labels, assignees }) => {
  const payload = {};
  if (title !== undefined) payload.title = title;
  if (body !== undefined) payload.body = body;
  if (state !== undefined) payload.state = state;
  if (labels !== undefined) payload.labels = labels;
  if (assignees !== undefined) payload.assignees = assignees;

  const { data } = await githubRequest(accessToken, (client) =>
    client.patch(`/repos/${owner}/${repo}/issues/${number}`, payload)
  );

  return formatIssue(data);
};

export const closeIssue = async (accessToken, owner, repo, number) => {
  return updateIssue(accessToken, owner, repo, number, { state: 'closed' });
};

export const addComment = async (accessToken, owner, repo, number, body) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.post(`/repos/${owner}/${repo}/issues/${number}/comments`, { body })
  );

  return formatComment(data);
};
