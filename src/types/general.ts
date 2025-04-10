export type Configurations = { readOnly: boolean; configs: Configuration[] } & EnvConfig

export type EnvConfig = {
  authenticationType: string
}
export type BaseConfiguration = {
  authorizerServiceUrl?: string
  authorizerApiKey?: string
  directoryServiceUrl?: string
  directoryApiKey?: string
  directoryTenantId?: string
  directoryReaderServiceUrl?: string
  directoryWriterServiceUrl?: string
  directoryModelServiceUrl?: string
}

export type Configuration = {
  name: string
  configurationType: string
  address?: string
} & BaseConfiguration


export enum QueryKeys {
  Config = 'Config',
}

export type Config = {
  authorizerServiceUrl?: string
  authorizerApiKey?: string
  directoryServiceUrl?: string
  directoryReaderServiceUrl?: string
  directoryWriterServiceUrl?: string
  directoryModelServiceUrl?: string
  directoryApiKey?: string
}
