import { callGeminiText } from './geminiHelper.js';

const WORKFLOW_SYSTEM_PROMPT = `You are a DevOps expert. Analyze GitHub Actions workflow failures and explain them clearly to developers. Provide actionable fix suggestions. Use markdown formatting.`;

export const explainWorkflowFailure = async (failureContext) => {
  const { run, failedJobs, failedSteps } = failureContext;

  const prompt = `
Analyze this failed GitHub Actions workflow run:

Workflow: ${run.name}
Branch: ${run.branch}
Event: ${run.event}
Status: ${run.status} / ${run.conclusion}
Run URL: ${run.htmlUrl}

Failed jobs: ${JSON.stringify(failedJobs.map((j) => j.name), null, 2)}

Failed steps:
${failedSteps.map((s) => `- Job "${s.job}": Step "${s.step}" (${s.status})`).join('\n') || 'No step details available'}

Explain likely causes and suggest concrete fixes.
`;

  const explanation = await callGeminiText(prompt, WORKFLOW_SYSTEM_PROMPT);
  return { explanation, runId: run.id };
};
