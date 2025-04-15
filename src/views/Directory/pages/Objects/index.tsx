import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'

import { useDirectoryV3ObjectTypesList } from '../../../../api/directory/customQuery'
import GenericObjects from './GenericObjects'
import UserObjects from './UserObjects'

const ObjectsSelector: React.FC = () => {
  const { objectType } = useParams()

  const { data } = useDirectoryV3ObjectTypesList()
  const objectTypes = useMemo(() => {
    return (data?.results || []).map((o) => o.name)
  }, [data?.results])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [objectType])

  if (!objectType || !objectTypes.includes(objectType)) {
    return null
  }

  switch (objectType) {
    case 'user':
      return <UserObjects />

    default:
      return <GenericObjects />
  }
}

export default ObjectsSelector
