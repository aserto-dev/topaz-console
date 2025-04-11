export type IsNameAvailableResponse = {
  isAvailable: boolean
  reason: string
}

export type UseIsNameAvailable = (name: string, defaultName: string) => IsNameAvailableResponse
