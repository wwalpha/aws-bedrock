import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getPresetById = async (presetId: string) => {
  return api.get(`/v1/presets/${encodeURIComponent(presetId)}`)
}

export const getPresetWorkspacesByWorkspaceId = async (workspaceId: string) => {
  return api.get(
    `/v1/workspaces/${encodeURIComponent(workspaceId)}?include=presets`
  )
}

export const getPresetWorkspacesByPresetId = async (presetId: string) => {
  return api.get(
    `/v1/presets/${encodeURIComponent(presetId)}?include=workspaces`
  )
}

export const createPreset = async (
  preset: TablesInsert<"presets">,
  workspace_id: string
) => {
  const created = await api.post(`/v1/presets`, preset)
  await createPresetWorkspace({
    user_id: created.user_id,
    preset_id: created.id,
    workspace_id
  })
  return created
}

export const createPresets = async (
  presets: TablesInsert<"presets">[],
  workspace_id: string
) => {
  const createdPresets = await api.post(`/v1/presets/bulk`, { items: presets })
  await createPresetWorkspaces(
    createdPresets.map((preset: any) => ({
      user_id: preset.user_id,
      preset_id: preset.id,
      workspace_id
    }))
  )
  return createdPresets
}

export const createPresetWorkspace = async (item: {
  user_id: string
  preset_id: string
  workspace_id: string
}) => {
  return api.post(`/v1/preset_workspaces`, item)
}

export const createPresetWorkspaces = async (
  items: { user_id: string; preset_id: string; workspace_id: string }[]
) => {
  return api.post(`/v1/preset_workspaces/bulk`, { items })
}

export const updatePreset = async (
  presetId: string,
  preset: TablesUpdate<"presets">
) => {
  return api.put(`/v1/presets/${encodeURIComponent(presetId)}`, preset)
}

export const deletePreset = async (presetId: string) => {
  await api.delete(`/v1/presets/${encodeURIComponent(presetId)}`)
  return true
}

export const deletePresetWorkspace = async (
  presetId: string,
  workspaceId: string
) => {
  await api.delete(
    `/v1/preset_workspaces?preset_id=${encodeURIComponent(presetId)}&workspace_id=${encodeURIComponent(workspaceId)}`
  )
  return true
}
