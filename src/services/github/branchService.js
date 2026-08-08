import { githubRequest } from './githubClient.js';
import { AppError } from '../../utils/AppError.js';

export const listBranches = async (accessToken, owner, repo, { page = 1, perPage = 100 } = {}) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/branches`, {
      params: { page, per_page: perPage },
    })
  );

  return data.map((branch) => ({
    name: branch.name,
    sha: branch.commit.sha,
    protected: branch.protected,
  }));
};

export const getBranch = async (accessToken, owner, repo, branch) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`)
  );

  return {
    name: data.name,
    sha: data.commit.sha,
    protected: data.protected,
  };
};

export const createBranch = async (accessToken, owner, repo, branchName, sha) => {
  if (!branchName?.trim()) {
    throw new AppError('Branch name is required', 400);
  }
  if (!sha?.trim()) {
    throw new AppError('Base SHA is required', 400);
  }

  const { data } = await githubRequest(accessToken, (client) =>
    client.post(`/repos/${owner}/${repo}/git/refs`, {
      ref: `refs/heads/${branchName.trim()}`,
      sha: sha.trim(),
    })
  );

  return {
    ref: data.ref,
    sha: data.object.sha,
    url: data.url,
  };
};

export const deleteBranch = async (accessToken, owner, repo, branch) => {
  await githubRequest(accessToken, (client) =>
    client.delete(`/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`)
  );

  return { deleted: true, branch };
};
