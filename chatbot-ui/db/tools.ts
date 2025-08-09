import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getToolById = async (toolId: string) => {
  return api.get(`/v1/tools/${encodeURIComponent(toolId)}`)
}

export const getToolWorkspacesByWorkspaceId = async (workspaceId: string) => {
  return api.get(`/v1/workspaces/${encodeURIComponent(workspaceId)}?include=tools`)
}

export const getToolWorkspacesByToolId = async (toolId: string) => {
  return api.get(`/v1/tools/${encodeURIComponent(toolId)}?include=workspaces`)
}

export const createTool = async (
  tool: TablesInsert<"tools">,
  workspace_id: string
) => {
  const created = await api.post(`/v1/tools`, tool)
  await createToolWorkspace({
    user_id: created.user_id,
    tool_id: created.id,
    workspace_id
  })
  return created
}

export const createTools = async (
  tools: TablesInsert<"tools">[],
  workspace_id: string
) => {
  const createdTools = await api.post(`/v1/tools/bulk`, { items: tools })
  await createToolWorkspaces(
    createdTools.map((tool: any) => ({
      user_id: tool.user_id,
      tool_id: tool.id,
      workspace_id
    }))
  )
  return createdTools
}

export const createToolWorkspace = async (item: {
  user_id: string
  tool_id: string
  workspace_id: string
}) => {
  return api.post(`/v1/tool_workspaces`, item)
}

export const createToolWorkspaces = async (
  items: { user_id: string; tool_id: string; workspace_id: string }[]
) => {
  return api.post(`/v1/tool_workspaces/bulk`, { items })
}

export const updateTool = async (
  toolId: string,
  tool: TablesUpdate<"tools">
) => {
  return api.put(`/v1/tools/${encodeURIComponent(toolId)}`, tool)
}

export const deleteTool = async (toolId: string) => {
  await api.delete(`/v1/tools/${encodeURIComponent(toolId)}`)
  return true
}

export const deleteToolWorkspace = async (
  toolId: string,
  workspaceId: string
) => {
  await api.delete(`/v1/tool_workspaces?tool_id=${encodeURIComponent(toolId)}&workspace_id=${encodeURIComponent(workspaceId)}`)
  return true
}
