import React, { useCallback, useState } from 'react'

import close from '../../assets/close.svg'
import { SuccessBannerProviderProps, SuccessMessageContext } from './hooks'
import { SuccessContent } from './style'

const SuccessBannerProvider: React.FC<SuccessBannerProviderProps> = ({
  children,
}) => {
  const [message, setMessage] = useState<null | string>(null)
  const clearMessage = useCallback(() => setMessage(null), [])
  const showMessage = useCallback((message: string) => setMessage(message), [])

  return (
    <SuccessMessageContext.Provider value={{ clearMessage, showMessage }}>
      <SuccessContent $show={!!message}>
        {message}
        <img alt="close success banner" src={close} onClick={clearMessage} />
      </SuccessContent>
      {children}
    </SuccessMessageContext.Provider>
  )
}

export default SuccessBannerProvider
