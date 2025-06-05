export type StoreState = AuthSlice

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthSlice {
  user: User | null
  accessToken: string | null
  idToken: string | null

  setAuthInfo: (user: User, accessToken: string, idToken: string) => void
  clearAuthInfo: () => void
}
