import React, { useEffect } from 'react'

import { V3Object } from '../../../../types/directory'
import ObjectInstanceBody from './ObjectInstanceBody'
import ObjectInstanceHeader from './ObjectInstanceHeader'
import {
  Container,
  DataLabel,
  DataRow,
  DataValue,
  MetadataContainer,
  ObjectContainer,
} from './styles'

const GenericObjectInstance: React.FC<{ object?: V3Object }> = ({ object }) => {
  const { id: objectId, type: objectType } = object || {}

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [objectType, objectId])

  return (
    <MetadataContainer>
      <ObjectInstanceHeader object={object} />
      <ObjectContainer>
        <Container>
          <DataRow>
            <DataLabel>ID:</DataLabel>
            <DataValue> {objectId}</DataValue>
          </DataRow>
        </Container>
      </ObjectContainer>
      <ObjectInstanceBody />
    </MetadataContainer>
  )
}

export default GenericObjectInstance
