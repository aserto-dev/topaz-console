import React from 'react'
import { storageProviderContext, StorageProviderProps } from './hooks'

export const MemoryStorageProvider: React.FC<
  React.PropsWithChildren<StorageProviderProps>
> = ({ children, local, session }) => (
  <storageProviderContext.Provider value={{ local, session }}>
    {children}
  </storageProviderContext.Provider>
)
