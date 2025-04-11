import { useEffect, useState } from 'react'

import useDebounce from '../throughput/useDebounce'
import { IsNameAvailableResponse, UseIsNameAvailable } from './useIsAvailable'

const nameAvailableResponse: IsNameAvailableResponse = {
  isAvailable: true,
  reason: '',
}

const useIsAvailableDebounced = (useTarget: UseIsNameAvailable): UseIsNameAvailable => {
  const useDebouncedTarget = (name: string, defaultName: string) => {
    const debouncedName = useDebounce(name, 200)
    const [response, setResponse] = useState(nameAvailableResponse)

    const serverResponse = useTarget(debouncedName, defaultName)
    useEffect(() => setResponse(serverResponse), [serverResponse])

    return response
  }

  return useDebouncedTarget
}

export default useIsAvailableDebounced
