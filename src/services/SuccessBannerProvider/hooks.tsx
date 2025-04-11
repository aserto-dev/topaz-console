import React, { PropsWithChildren, useContext } from 'react'

type SuccessBannerContextProps = {
  clearMessage: () => void
  showMessage: (message: string) => void
}

export type SuccessBannerProviderProps = PropsWithChildren

export const SuccessMessageContext =
  React.createContext<SuccessBannerContextProps>({
    clearMessage: () => {},
    showMessage: () => {},
  })

export const useShowSuccessMessage = () => {
  const { showMessage } = useContext(SuccessMessageContext)
  return showMessage
}
