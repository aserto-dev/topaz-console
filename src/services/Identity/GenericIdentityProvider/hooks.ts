import React from "react"

 type User = {
  sub?: string
  email?: string
  name?: string
  picture?: string
  nickname?: string
}

type IdentityProviderContextProps = {
  user?: User
  getAccessToken: () => Promise<string>
  logout: () => void
}

export type GenericIdentityProviderProps = {
  children: React.ReactNode
  identity: IdentityProviderContextProps
}

export const identityProviderContext = React.createContext<
  IdentityProviderContextProps | undefined
>(undefined)

