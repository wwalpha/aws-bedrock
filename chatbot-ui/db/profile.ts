import { api } from "@/lib/api/client"
import { TablesInsert, TablesUpdate } from "@/types/db"

export const getProfileByUserId = async (userId: string) => {
  return api.get(`/v1/profiles?user_id=${encodeURIComponent(userId)}&single=1`)
}

export const getProfilesByUserId = async (userId: string) => {
  return api.get(`/v1/profiles?user_id=${encodeURIComponent(userId)}`)
}

export const createProfile = async (profile: TablesInsert<"profiles">) => {
  return api.post(`/v1/profiles`, profile)
}

export const updateProfile = async (
  profileId: string,
  profile: TablesUpdate<"profiles">
) => {
  return api.put(`/v1/profiles/${encodeURIComponent(profileId)}`, profile)
}

export const deleteProfile = async (profileId: string) => {
  await api.delete(`/v1/profiles/${encodeURIComponent(profileId)}`)
  return true
}
