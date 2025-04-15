import React from "react"

 export type GenericIdentityProviderProps = {
  children: React.ReactNode
  identity: IdentityProviderContextProps
}

type IdentityProviderContextProps = {
  getAccessToken: () => Promise<string>
  logout: () => void
  user?: User
}

type User = {
  email?: string
  name?: string
  nickname?: string
  picture?: string
  sub?: string
}

export const identityProviderContext = React.createContext<
  IdentityProviderContextProps | undefined
>(undefined)

