import React from 'react'
import styled from 'styled-components'

import { Curve } from '../styles'

const CurveContainer = styled.div`
  margin-top: -10px;
`

export const SubField = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <CurveContainer>
        <Curve />
      </CurveContainer>
      {children}
    </div>
  )
}
