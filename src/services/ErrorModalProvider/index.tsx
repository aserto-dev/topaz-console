import React, { PropsWithChildren, useContext } from 'react'

export type ErrorModalProviderProps = PropsWithChildren

type ErrorModalProviderContextProps = {
  clearError: () => void
  isErrorVisible: boolean
  showError: (error: unknown) => void
  showErrorWithLogout: (error: unknown, logout: () => undefined | void) => void
}

export const ErrorContext = React.createContext<ErrorModalProviderContextProps>(
  {
    clearError: () => {},
    isErrorVisible: false,
    showError: () => {},
    showErrorWithLogout: () => {},
  },
)

export const useShowError = () => {
  const { showError } = useContext(ErrorContext)
  return showError
}
