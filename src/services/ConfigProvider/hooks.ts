import React, { useContext } from "react"
import { Config } from "../../types/general"

const emptyConfig = {
  authorizerServiceUrl: '',
  authorizerApiKey: '',
  directoryServiceUrl: '',
  directoryReaderServiceUrl: '',
  directoryWriterServiceUrl: '',
  directoryModelServiceUrl: '',
  directoryApiKey: '',
  authenticationType: ''
}
export const ConfigContext = React.createContext<Config>(emptyConfig)

export const useConfig = () => {
  const config = useContext(ConfigContext)
  if (config === emptyConfig) {
    throw 'Config must be retrieved in the context of a <ConfigProvider>'
  }

  return config
}
