import React, { useEffect } from 'react'

import userAvatar from '../../../../assets/generic-user-avatar.svg'
import { V3Object } from '../../../../types/directory'
import ObjectInstanceBody from './ObjectInstanceBody'
import ObjectInstanceHeader from './ObjectInstanceHeader'
import {
  Container,
  DataLabel,
  DataRow,
  DataValue,
  FullContainer,
  ObjectContainer,
  UserImage,
} from './styles'

const UserObjectInstance: React.FC<{ object?: V3Object }> = ({ object }) => {
  const { id: objectId, type: objectType } = object || {}

  const userProps: { email?: string; picture?: string; } =
    object?.properties || {}

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [objectType, objectId])

  return (
    <>
      <FullContainer>
        <ObjectInstanceHeader object={object} />
        <ObjectContainer>
          <UserImage
            alt="show"
            src={userProps.picture}
            onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => {
              event.currentTarget.src = userAvatar
            }}
          />
          <Container>
            {!!object && (
              <DataRow>
                <DataLabel>Email:&nbsp;&nbsp;&nbsp;</DataLabel>
                <DataValue>{userProps.email}</DataValue>
              </DataRow>
            )}
            <DataRow>
              <DataLabel>User ID:</DataLabel>
              <DataValue> {objectId}</DataValue>
            </DataRow>
          </Container>
        </ObjectContainer>
        <ObjectInstanceBody />
      </FullContainer>
    </>
  )
}

export default UserObjectInstance
