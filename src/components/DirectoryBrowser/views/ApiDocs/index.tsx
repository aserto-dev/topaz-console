import { useConfig } from '../../../../services/ConfigProvider/hooks'
import ApiBrowser from '../../../ApiBrowser'

const DirectoryApiDocs = () => {
  const { directoryApiKey, directoryServiceUrl } = useConfig()

  return (
    <ApiBrowser
      apiKeys={[
        {
          key: 'DirectoryAPIKey',
          value: directoryApiKey ? `Basic ${directoryApiKey}` : '',
        },
      ]}
      openApiUrl={`${directoryServiceUrl}/directory/openapi.json`}
    ></ApiBrowser>
  )
}

export default DirectoryApiDocs
