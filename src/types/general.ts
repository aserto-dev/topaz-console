export enum QueryKeys {
  Config = 'Config',
}

 export type Config = {
  authenticationType: string
  authorizerApiKey?: string
  authorizerServiceUrl?: string
  directoryApiKey?: string
  directoryModelServiceUrl?: string
  directoryReaderServiceUrl?: string
  directoryServiceUrl?: string
  directoryWriterServiceUrl?: string
}
 export type Configurations = EnvConfig & { configs: Configuration[]; readOnly: boolean; }

 type BaseConfiguration = {
  authorizerApiKey?: string
  authorizerServiceUrl?: string
  directoryApiKey?: string
  directoryModelServiceUrl?: string
  directoryReaderServiceUrl?: string
  directoryServiceUrl?: string
  directoryTenantId?: string
  directoryWriterServiceUrl?: string
}


type Configuration = BaseConfiguration & {
  address?: string
  configurationType: string
  name: string
}

type EnvConfig = {
  authenticationType: string
}
