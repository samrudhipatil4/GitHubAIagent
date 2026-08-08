import {
  listWorkflowRuns,
  getWorkflowRun,
  getFailedRuns,
  getLatestDeployment,
  rerunWorkflow,
  getWorkflowFailureContext,
} from '../services/github/actionsService.js';
import { explainWorkflowFailure } from '../services/ai/workflowAnalysisService.js';
import { successResponse } from '../utils/apiResponse.js';

export const listRuns = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const result = await listWorkflowRuns(req.accessToken, owner, repo);
    return successResponse(res, 'Workflow runs retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const getRun = async (req, res, next) => {
  try {
    const { owner, repo, runId } = req.params;
    const run = await getWorkflowRun(req.accessToken, owner, repo, runId);
    return successResponse(res, 'Workflow run retrieved', { run });
  } catch (error) {
    next(error);
  }
};

export const getFailed = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const runs = await getFailedRuns(req.accessToken, owner, repo);
    return successResponse(res, 'Failed workflow runs retrieved', { runs });
  } catch (error) {
    next(error);
  }
};

export const getDeployment = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const deployment = await getLatestDeployment(req.accessToken, owner, repo);
    return successResponse(res, 'Latest deployment retrieved', { deployment });
  } catch (error) {
    next(error);
  }
};

export const rerunRun = async (req, res, next) => {
  try {
    const { owner, repo, runId } = req.params;
    const result = await rerunWorkflow(req.accessToken, owner, repo, runId);
    return successResponse(res, 'Workflow rerun triggered', result);
  } catch (error) {
    next(error);
  }
};

export const explainFailure = async (req, res, next) => {
  try {
    const { owner, repo, runId } = req.params;
    const context = await getWorkflowFailureContext(req.accessToken, owner, repo, runId);
    const result = await explainWorkflowFailure(context);
    return successResponse(res, 'Workflow failure explained', result);
  } catch (error) {
    next(error);
  }
};
