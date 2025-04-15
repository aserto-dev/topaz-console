import React from 'react'
import styled from 'styled-components'

import radial from '../../../assets/light-gray-radial-gradient.svg'
import { theme } from '../../../theme'

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const BackgroundImage = styled.img`
  width: 400px;
  height: 300px;
  position: absolute;
`

const ForegroundImage = styled.img`
  width: 82px;
  height: 82px;
  fill: ${theme.grey100};
  margin-top: 159px;
`

const HeaderText = styled.span<{ $hasButton?: boolean }>`
  margin-top: ${({ $hasButton }) => ($hasButton ? '0' : '27')}px;
  height: 31px;
  background-size: cover;
  font-family: Roboto;
  font-size: 16px;
  color: ${theme.grey100};
  text-decoration: none solid ${theme.grey100};
  line-height: 24px;
  text-align: center;
`

const BodyText = styled.span`
  height: 31px;
  background-size: cover;
  font-family: Roboto;
  font-size: 14px;
  color: ${theme.grey70};
  text-decoration: none solid ${theme.grey70};
  line-height: 24px;
  text-align: center;
  white-space: pre-line;
`

type EmptyTablePlaceholderProps = {
  body: React.ReactNode | string
  header: string
  imgAlt: string
  imgSrc: string
  node?: React.ReactNode
}

const EmptyTablePlaceholder: React.FC<EmptyTablePlaceholderProps> = ({
  body,
  header,
  imgAlt,
  imgSrc,
  node,
}) => {
  return (
    <Container>
      {!node && (
        <BackgroundImage alt="background radial gradient" src={radial} />
      )}
      <Container>
        <ForegroundImage alt={imgAlt} src={imgSrc} />
        <HeaderText $hasButton={!!node}>
          <b>{header}</b>
        </HeaderText>
        {node}
        <BodyText>{body}</BodyText>
      </Container>
    </Container>
  )
}

export default EmptyTablePlaceholder
