import 'rapidoc'
import './index.css'

import React, { useEffect } from 'react'
import { theme } from '../../theme'

interface RapiDocElement extends HTMLElement {
  setApiKey(key: string, value: string): boolean
}

type ApiBrowserProps = {
  openApiUrl: string
  apiKeys: {
    key: string
    value: string
  }[]
}
const ApiBrowser: React.FC<ApiBrowserProps> = ({ openApiUrl, apiKeys }) => {
  useEffect(() => {
    const rapidocEL = document.getElementById('docs') as RapiDocElement
    if (rapidocEL) {
      rapidocEL.addEventListener('spec-loaded', async () => {
        apiKeys.forEach((apiKey) => {
          rapidocEL.setApiKey(apiKey.key, apiKey.value)
        })
      })
    }
  }, [apiKeys])

  return (
    <rapi-doc
      bg-color={theme.primaryBlack}
      id="docs"
      nav-bg-color={theme.grey10}
      primary-color={theme.primary}
      render-style="read"
      show-header="false"
      spec-url={openApiUrl}
    ></rapi-doc>
  )
}

export default ApiBrowser
