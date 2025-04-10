import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

import ErrorModal from "./ErrorModal";
import ensureError from "../../lib/error/ensureError";

type ErrorModalProviderContextProps = {
  clearError: () => void;
  isErrorVisible: boolean;
  showError: (error: unknown) => void;
  showErrorWithLogout: (error: unknown, logout: () => void | undefined) => void;
};

type ErrorModalProviderProps = PropsWithChildren;

const ErrorContext = React.createContext<ErrorModalProviderContextProps>({
  clearError: () => {},
  isErrorVisible: false,
  showError: () => {},
  showErrorWithLogout: () => {},
});

export const useShowError = () => {
  const { showError } = useContext(ErrorContext);
  return showError;
};

export const useIsErrorModalVisibile = () => {
  const { isErrorVisible } = useContext(ErrorContext);
  return isErrorVisible;
};

const ErrorModalProvider: React.FC<ErrorModalProviderProps> = ({
  children,
}) => {
  const [logout, setLogout] = useState<() => void | undefined>();
  const [error, setError] = useState<Error | null>(null);
  const clearError = useCallback(() => setError(null), []);
  const showError = useCallback((error: unknown) => {
    setLogout(undefined);
    const ensuredError = ensureError(error);
    setError(ensuredError);
  }, []);

  const showErrorWithLogout = useCallback(
    (error: unknown, logout: () => void) => {
      setLogout(logout);
      const ensuredError = ensureError(error);
      setError(ensuredError);
    },
    []
  );

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
  );
};

export default ErrorModalProvider;
