import { toolHandlers } from '../tools/githubTools.js';
import { MCP_TO_HANDLER, HANDLER_TO_MCP, mcpToolDefinitions } from './mcpToolMap.js';
import { AppError } from '../utils/AppError.js';

export const listTools = () => mcpToolDefinitions;

export const resolveHandlerName = (toolName) => {
  if (MCP_TO_HANDLER[toolName]) return MCP_TO_HANDLER[toolName];
  if (toolHandlers[toolName]) return toolName;
  if (HANDLER_TO_MCP[toolName]) return toolName;
  return null;
};

export const callTool = async (toolName, args, accessToken) => {
  const handlerName = resolveHandlerName(toolName);

  if (!handlerName) {
    throw new AppError(`Unknown MCP tool: ${toolName}`, 400);
  }

  const handler = toolHandlers[handlerName];
  if (!handler) {
    throw new AppError(`Handler not found for tool: ${toolName}`, 500);
  }

  try {
    const data = await handler(args || {}, accessToken);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], data };
  } catch (error) {
    return {
      content: [{ type: 'text', text: error.message || 'Tool execution failed' }],
      isError: true,
      error: error.message,
    };
  }
};
