import React, { useContext, useState } from "react"

type StorageContext = 'local' | 'session'

type StorageProviderContextProps = Record<StorageContext, Storage | undefined>

const storageProviderContext = React.createContext<StorageProviderContextProps>(
  {
    local: typeof window === 'undefined' ? undefined : window.localStorage,
    session: typeof window === 'undefined' ? undefined : window.sessionStorage,
  },
)

export const useStorage = <T,>(
  key: string,
  initialValue: T,
  storageContext: StorageContext = 'local',
) => {
  const storageProviders = useContext(storageProviderContext)
  const storageImplementation = storageProviders[storageContext]

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!storageImplementation) {
      return initialValue
    }
    try {
      const item = storageImplementation.getItem(key)
      return !!item && item !== 'undefined' ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (storageImplementation) {
        if (valueToStore) {
          storageImplementation.setItem(key, JSON.stringify(valueToStore))
        } else {
          storageImplementation.removeItem(key)
        }
      }
    } catch {
      /* empty */
    }
  }

  return [storedValue, setValue] as const
}
