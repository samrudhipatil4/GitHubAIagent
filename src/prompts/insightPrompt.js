export const INSIGHT_SYSTEM_PROMPT = `You are an expert software engineer and technical writer. Analyze GitHub repositories and provide clear, accurate, helpful insights for developers. Use markdown formatting when appropriate. Be concise but thorough.`;

export const buildSummaryPrompt = (repo, stats) => `
Analyze this GitHub repository and provide a concise summary (3-5 sentences):

Repository: ${repo.fullName}
Description: ${repo.description || 'No description'}
Language: ${repo.language || 'Unknown'}
Stars: ${repo.stars} | Forks: ${repo.forks} | Open Issues: ${repo.openIssues}
Default Branch: ${repo.defaultBranch}
Created: ${repo.createdAt}

Languages: ${JSON.stringify(stats?.languages?.slice(0, 5) || [])}

Cover: purpose, tech stack, maturity, and overall health.
`;

export const buildExplainPrompt = (repo, tree, readme) => `
Explain what this GitHub repository does and how it's organized:

Repository: ${repo.fullName}
Description: ${repo.description || 'None'}
README excerpt: ${readme?.slice(0, 2000) || 'No README found'}

Top-level structure:
${tree?.slice(0, 30).map((t) => `- ${t.path} (${t.type})`).join('\n') || 'Unknown'}

Provide a detailed but readable explanation for a developer new to this project.
`;

export const buildReadmePrompt = (repo, tree, existingReadme) => `
Generate a professional README.md for this repository:

Name: ${repo.fullName}
Description: ${repo.description || ''}
Language: ${repo.language || ''}
Existing README: ${existingReadme ? 'Yes (improve it)' : 'No (create new)'}

Structure:
${tree?.slice(0, 20).map((t) => t.path).join('\n') || ''}

Include: title, description, features, installation, usage, and license sections.
Return ONLY the README markdown content, no extra commentary.
`;

export const buildStructurePrompt = (tree) => `
Explain this repository folder structure. For each major directory/file, explain its likely purpose:

${tree?.slice(0, 50).map((t) => `${t.type === 'tree' ? '📁' : '📄'} ${t.path}`).join('\n') || 'No structure available'}

Organize by directories and explain the architecture.
`;

export const buildPackageJsonPrompt = (content) => `
Explain this package.json file for a developer:

\`\`\`json
${content?.slice(0, 4000) || '{}'}
\`\`\`

Cover: project purpose, key dependencies, scripts, and anything notable.
`;

export const buildDockerfilePrompt = (content) => `
Explain this Dockerfile:

\`\`\`dockerfile
${content?.slice(0, 4000) || ''}
\`\`\`

Cover: base image, build steps, exposed ports, and deployment considerations.
`;
