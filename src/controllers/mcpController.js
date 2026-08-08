import { listTools } from '../mcp/githubMcpServer.js';
import { successResponse } from '../utils/apiResponse.js';

export const getTools = (_req, res) => {
  return successResponse(res, 'MCP tools retrieved', { tools: listTools() });
};
