import React, { useState } from 'react'
import styled from 'styled-components'

import Logo from '../../../assets/topaz-logo.svg'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import { theme } from '../../../theme'
import { RpcStatus } from '../../../types/directory'

const ScreenContainer = styled.div`
  display: flex;
  align-items: stretch;
  background-color: ${theme.primaryBlack};
  width: 100vw;
  height: 100vh;
  position: relative;
`

const Header = styled.div`
  height: 80px;
  width: 100vw;
  background-color: ${theme.grey20};
  border: 1px solid ${theme.grey30};
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const Body = styled.div`
  margin-top: 80px;
  display: flex;
  width: 100vw;
  flex-direction: column;
  justify-content: center;
`

const LoginBoxContainer = styled.div`
  width: 540px;
  background-color: ${theme.grey10};
  border-radius: 6px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const LogoImg = styled.img`
  width: 96px;
  height: 96px;
  margin-left: 24px;
`

const WelcomeContainer = styled.div`
  font-size: var(--title-font-size);
  color: ${theme.grey100};
  height: 64px;
  background-color: ${theme.grey20};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding: 0 0 0 20px;
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 24px;
`

const ContentContainer = styled.div`
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-content: center;
  justify-content: center;
`

const ContinueButtonContainer = styled(Button)`
  width: 100%;
  height: 36px;
  margin-bottom: 24px;
`

type ApiLoginProps = {
  loginFunc: (key: string) => Promise<Error | RpcStatus | undefined>
  setApiKey: (apiKey: string) => void
}
const ApiKeyLogin: React.FC<ApiLoginProps> = ({ loginFunc, setApiKey }) => {
  const [formApiKey, setFormApiKey] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      const error = await loginFunc(formApiKey)
      if (error) {
        setErrorMessage(`Authentication failed.`)
      } else {
        setApiKey(formApiKey)
      }
    } catch {
      setErrorMessage(`Unexpected error.`)
    }

    event.preventDefault()
  }
  return (
    <ScreenContainer>
      <Header>
        <LogoImg alt="logo" src={Logo} />
      </Header>
      <Body>
        <LoginBoxContainer>
          <WelcomeContainer>Welcome to Topaz Console!</WelcomeContainer>
          <ContentContainer>
            Enter your API key to securely access your account. If you don't
            have an API key yet, please contact your Administrator to obtain
            one.
            <Input
              error={errorMessage}
              placeholder="Api Key"
              shouldShowHideShowButton
              type="password"
              value={formApiKey}
              onChange={(e) => setFormApiKey(e.target.value || '')}
            />
            <ContinueButtonContainer
              disabled={formApiKey === ''}
              type="submit"
              onClick={handleSubmit}
            >
              Continue
            </ContinueButtonContainer>
          </ContentContainer>
        </LoginBoxContainer>
      </Body>
    </ScreenContainer>
  )
}

export default ApiKeyLogin
