import React, { PropsWithChildren, useContext } from 'react'

export type SuccessBannerProviderProps = PropsWithChildren

type SuccessBannerContextProps = {
  clearMessage: () => void
  showMessage: (message: string) => void
}

export const SuccessMessageContext =
  React.createContext<SuccessBannerContextProps>({
    clearMessage: () => {},
    showMessage: () => {},
  })

export const useShowSuccessMessage = () => {
  const { showMessage } = useContext(SuccessMessageContext)
  return showMessage
}
