import React, { PropsWithChildren, useContext } from 'react'

type ErrorModalProviderContextProps = {
  clearError: () => void
  isErrorVisible: boolean
  showError: (error: unknown) => void
  showErrorWithLogout: (error: unknown, logout: () => void | undefined) => void
}

export type ErrorModalProviderProps = PropsWithChildren

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
