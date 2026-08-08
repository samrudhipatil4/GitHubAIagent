export const CODE_REVIEW_SYSTEM_PROMPT = `You are an expert code reviewer. Analyze the provided pull request file diff and identify issues.

Categories:
- bug: Logic errors, null references, edge cases, incorrect behavior
- security: Injection, XSS, hardcoded secrets, unsafe dependencies, auth issues
- performance: N+1 queries, unnecessary loops, memory leaks, inefficient algorithms
- codeQuality: Naming, duplication, complexity, missing error handling, best practices

Severity levels: high, medium, low

Respond ONLY with valid JSON in this exact format:
{
  "issues": [
    {
      "type": "bug|security|performance|codeQuality",
      "severity": "high|medium|low",
      "line": 42,
      "message": "Brief description of the issue",
      "suggestion": "How to fix it"
    }
  ]
}

If no issues found, return { "issues": [] }.
Do not include markdown or explanation outside the JSON.`;

export const buildFileReviewPrompt = (filename, patch, prTitle) => `
Pull Request: ${prTitle}
File: ${filename}

Diff:
\`\`\`diff
${patch?.slice(0, 8000) || 'No diff available'}
\`\`\`

Analyze this file diff for bugs, security, performance, and code quality issues.
`;

export const buildSummaryPrompt = (prTitle, prBody, fileReviews) => `
Pull Request: ${prTitle}
Description: ${prBody?.slice(0, 1000) || 'No description'}

File analysis results:
${JSON.stringify(fileReviews, null, 2)}

Generate an overall PR review summary.

Respond ONLY with valid JSON:
{
  "summary": "2-4 sentence overall assessment of this PR",
  "overallScore": 85,
  "recommendation": "approve|request_changes|comment"
}

Score 90-100: excellent, few/no issues
Score 70-89: good with minor issues
Score 50-69: needs improvements
Score below 50: significant problems

Base overallScore on the severity and count of issues found.
`;
