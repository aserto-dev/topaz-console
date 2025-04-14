import { useConfig } from '../../../../services/ConfigProvider/hooks'
import ApiBrowser from '../../../../components/ApiBrowser'

const AuthorizerApiDocs = () => {
  const { authorizerApiKey, authorizerServiceUrl } = useConfig()

  return (
    <ApiBrowser
      apiKeys={[
        {
          key: 'AuthorizerAPIKey',
          value: authorizerApiKey ? `Basic ${authorizerApiKey}` : '',
        },
      ]}
      openApiUrl={`${authorizerServiceUrl}/authorizer/openapi.json`}
    ></ApiBrowser>
  )
}

export default AuthorizerApiDocs
