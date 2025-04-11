import { useState, useCallback } from 'react'
import ensureError from '../../lib/error/ensureError'
import ErrorModal from './ErrorModal'
import { ErrorContext, ErrorModalProviderProps } from '.'

const ErrorModalProvider: React.FC<ErrorModalProviderProps> = ({
  children,
}) => {
  const [logout, setLogout] = useState<() => void | undefined>()
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
        showError,
        isErrorVisible: !!error,
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
