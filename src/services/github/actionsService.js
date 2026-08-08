import { githubRequest } from './githubClient.js';

const formatRun = (run) => ({
  id: run.id,
  name: run.name,
  status: run.status,
  conclusion: run.conclusion,
  branch: run.head_branch,
  event: run.event,
  createdAt: run.created_at,
  updatedAt: run.updated_at,
  htmlUrl: run.html_url,
  workflowId: run.workflow_id,
  runNumber: run.run_number,
});

export const listWorkflowRuns = async (accessToken, owner, repo, { status, perPage = 20 } = {}) => {
  const params = { per_page: perPage };
  if (status) params.status = status;

  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/actions/runs`, { params })
  );

  return {
    totalCount: data.total_count,
    runs: data.workflow_runs.map(formatRun),
  };
};

export const getWorkflowRun = async (accessToken, owner, repo, runId) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/actions/runs/${runId}`)
  );

  return formatRun(data);
};

export const getWorkflowRunJobs = async (accessToken, owner, repo, runId) => {
  const { data } = await githubRequest(accessToken, (client) =>
    client.get(`/repos/${owner}/${repo}/actions/runs/${runId}/jobs`)
  );

  return data.jobs.map((job) => ({
    id: job.id,
    name: job.name,
    status: job.status,
    conclusion: job.conclusion,
    startedAt: job.started_at,
    completedAt: job.completed_at,
    steps: (job.steps || []).map((step) => ({
      name: step.name,
      status: step.status,
      conclusion: step.conclusion,
      number: step.number,
    })),
  }));
};

export const rerunWorkflow = async (accessToken, owner, repo, runId) => {
  await githubRequest(accessToken, (client) =>
    client.post(`/repos/${owner}/${repo}/actions/runs/${runId}/rerun`)
  );

  return { rerun: true, runId };
};

export const getFailedRuns = async (accessToken, owner, repo) => {
  const { runs } = await listWorkflowRuns(accessToken, owner, repo, { perPage: 30 });
  return runs.filter((run) => run.conclusion === 'failure' || run.conclusion === 'cancelled');
};

export const getLatestDeployment = async (accessToken, owner, repo) => {
  const { runs } = await listWorkflowRuns(accessToken, owner, repo, { perPage: 30 });
  const successful = runs.find((run) => run.conclusion === 'success');
  return successful || null;
};

export const getWorkflowFailureContext = async (accessToken, owner, repo, runId) => {
  const [run, jobs] = await Promise.all([
    getWorkflowRun(accessToken, owner, repo, runId),
    getWorkflowRunJobs(accessToken, owner, repo, runId),
  ]);

  const failedJobs = jobs.filter((job) => job.conclusion === 'failure');
  const failedSteps = failedJobs.flatMap((job) =>
    job.steps
      .filter((step) => step.conclusion === 'failure')
      .map((step) => ({ job: job.name, step: step.name, status: step.status }))
  );

  return { run, jobs, failedJobs, failedSteps };
};
