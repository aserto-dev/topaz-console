import React, { useCallback } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { theme } from '../../../../../theme'
import { V3Object } from '../../../../../types/directory'
import ObjectGraphComponent from '../ObjectGraphComponent'
import { ContentContainer } from '../styles'

const ReactFlowContainer = styled.div`
  height: calc(100vh - 315px);
  width: calc(100vw - 200px);
  @media (max-width: 1198px) {
    width: calc(100vw - 250px);
  }
  @media (max-width: 912px) {
    height: calc(100vh - 365px);
    width: 100vw;
  }
  .react-flow__node-custom {
    border: 1px solid ${theme.grey30};
    border-radius: 5px;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
  }
`

const ObjectGraph: React.FC<{ object?: V3Object }> = ({ object }) => {
  const navigate = useNavigate()
  const { id: objectId, type: objectType } = object || {}

  const obj: V3Object = {
    display_name: object?.display_name || objectId,
    id: objectId || '',
    type: objectType || '',
  }
  const setObject = useCallback(
    (o: V3Object) => {
      navigate(`/ui/directory/objects/${o.type}/${encodeURIComponent(o.id)}`)
    },
    [navigate],
  )

  return (
    <ContentContainer>
      <ReactFlowContainer>
        <ObjectGraphComponent object={obj} setObject={setObject} />
      </ReactFlowContainer>
    </ContentContainer>
  )
}

export default ObjectGraph
