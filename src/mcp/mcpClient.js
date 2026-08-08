import { callTool as serverCallTool, listTools } from './githubMcpServer.js';
import { HANDLER_TO_MCP } from './mcpToolMap.js';

export class McpClient {
  listTools() {
    return listTools();
  }

  async callTool(name, args, accessToken) {
    const mcpName = HANDLER_TO_MCP[name] || name;
    const result = await serverCallTool(mcpName, args, accessToken);

    if (result.isError) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  }
}

export const mcpClient = new McpClient();
