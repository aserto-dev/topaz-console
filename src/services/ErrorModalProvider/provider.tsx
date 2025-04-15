import { useCallback, useState } from 'react'

import { ErrorContext, ErrorModalProviderProps } from '.'
import ensureError from '../../lib/error/ensureError'
import ErrorModal from './ErrorModal'

const ErrorModalProvider: React.FC<ErrorModalProviderProps> = ({
  children,
}) => {
  const [logout, setLogout] = useState<() => undefined | void>()
  const [error, setError] = useState<Error | null>(null)
  const clearError = useCallback(() => setError(null), [])
  const showError = useCallback((error: unknown) => {
    setLogout(undefined)
    const ensuredError = ensureError(error)
    setError(ensuredError)
  }, [])

  const showErrorWithLogout = useCallback(
    (error: unknown, logout: () => void) => {
      setLogout(logout)
      const ensuredError = ensureError(error)
      setError(ensuredError)
    },
    [],
  )

  return (
    <ErrorContext.Provider
      value={{
        clearError,
        isErrorVisible: !!error,
        showError,
        showErrorWithLogout,
      }}
    >
      <ErrorModal
        error={error}
        onClose={() => setError(null)}
        onLogout={logout}
      />
      {children}
    </ErrorContext.Provider>
  )
}

export default ErrorModalProvider
