import React, { useMemo } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router'

import { useDirectoryReaderV3ObjectGet } from '../../../../api/v3/directory'
import GenericObjectInstance from './GenericObjectInstance'
import ObjectGraph from './ObjectGraph'
import ObjectJson from './ObjectJson'
import ObjectProperties from './ObjectProperties'
import ObjectRelations from './ObjectRelations'
import UserObjectInstance from './UserObjectInstance'

const ObjectInstanceRouter: React.FC = () => {
  const { objectId, objectType } = useParams()
  const safeObjectType = objectType || ''
  const safeObjectId = objectId || ''
  const { data: objectData, isLoading } = useDirectoryReaderV3ObjectGet(
    safeObjectType,
    safeObjectId,
    {},
    {
      query: {
        meta: {
          showError: false,
        },
        retry: false,
      },
    },
  )
  const object = useMemo(() => {
    return (
      objectData?.result || {
        id: safeObjectId,
        type: safeObjectType,
      }
    )
  }, [objectData, safeObjectId, safeObjectType])

  if (isLoading) {
    return null
  }

  let element: React.JSX.Element
  switch (objectType) {
    case 'user':
      element = <UserObjectInstance object={object} />
      break
    default:
      element = <GenericObjectInstance object={object} />
      break
  }
  return (
    <Routes>
      <Route element={element} path="">
        <Route element={<ObjectGraph object={object} />} path="graph" />
        <Route
          element={<ObjectProperties object={object} />}
          path="properties"
        />

        <Route
          element={<ObjectRelations object={object} relationSide="incoming" />}
          path="incoming-relations"
        />

        <Route
          element={<ObjectRelations object={object} relationSide="outgoing" />}
          path="outgoing-relations"
        />

        <Route
          element={<ObjectRelations object={object} relationSide="incoming" />}
          path="incoming-relations/:relationSubject/:relationType"
        />
        <Route
          element={<ObjectRelations object={object} relationSide="outgoing" />}
          path="outgoing-relations/:relationSubject/:relationType"
        />
        <Route element={<ObjectJson object={object} />} path="json" />
        <Route element={<Navigate replace to="graph" />} index />
        <Route element={<Navigate replace to="graph" />} path="*" />
      </Route>
    </Routes>
  )
}

export default ObjectInstanceRouter
