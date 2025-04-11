/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { QueryKey } from '@tanstack/react-query'

import { SelectOption } from '../../components/common/Select'
import { V3CheckRequest } from '../../types/directory'
import { useDirectoryReaderV3ObjectGet } from '../../api/v3/directory'
import { DirectoryContext, DisplayStateMap } from './context'

const DirectoryContextProvider = ({
  displayState,
  children,
}: {
  displayState: DisplayStateMap
  children: React.ReactNode
}) => {
  // model State
  const location: { state: V3CheckRequest } = useLocation()
  const {
    object_type,
    object_id,
    subject_type,
    subject_id,
    relation: check_relation,
  } = location.state || {}

  const object = useDirectoryReaderV3ObjectGet(object_type, object_id)
  const subject = useDirectoryReaderV3ObjectGet(subject_type, subject_id)

  const defaultRelationInstace = useMemo(() => {
    if (!check_relation) {
      return
    }

    return {
      label: check_relation,
      value: check_relation,
    }
  }, [check_relation])

  const defaultObjectInstance = useMemo(() => {
    const obj = object.data?.result
    if (!obj) {
      return
    }

    return {
      label: obj.display_name || obj.id,
      value: obj.id,
    }
  }, [object.data?.result])

  const defaultSubjectInstance = useMemo(() => {
    const obj = subject.data?.result
    if (!obj) {
      return
    }

    return {
      label: obj.display_name || obj.id,
      value: obj.id,
    }
  }, [subject.data?.result])

  // model
  const [visible, setVisible] = useState(false)
  const [code, setCode] = useState<string>('')
  const [request, setRequest] = useState('check')
  const [subjectType, setSubjectType] = useState('user')
  const [subjectInstance, setSubjectInstance] = useState<SelectOption | null>(
    null,
  )
  const [relationType, setRelationType] = useState<SelectOption | null>(null)
  const [objectType, setObjectType] = useState('group')
  const [objectInstance, setObjectInstance] = useState<SelectOption | null>(
    null,
  )

  // data
  const [dataObjectType, setDataObjectType] = useState<string | undefined>(
    undefined,
  )
  const [dataSubjectType, setDataSubjectType] = useState<string | undefined>(
    undefined,
  )
  const [relation, setRelation] = useState<string | undefined>(undefined)

  const [subjectRelation, setSubjectRelation] = useState<string | undefined>(
    undefined,
  )
  const [relationsQueryKey, setRelationsQueryKey] = useState<
    QueryKey | undefined
  >(undefined)

  const [objectId, setObjectId] = useState<string | undefined>(undefined)
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined)

  // default state
  useEffect(() => {
    defaultObjectInstance && setObjectInstance(defaultObjectInstance)
  }, [setObjectInstance, defaultObjectInstance])

  useEffect(() => {
    defaultSubjectInstance && setSubjectInstance(defaultSubjectInstance)
  }, [setSubjectInstance, defaultSubjectInstance])

  useEffect(() => {
    defaultRelationInstace && setRelationType(defaultRelationInstace)
  }, [setRelationType, defaultRelationInstace])

  useEffect(() => {
    location.state !== null && setObjectType(object_type)
  }, [location.state, setObjectType, object_type])

  useEffect(() => {
    location.state !== null && setSubjectType(subject_type)
  }, [location.state, setSubjectType, subject_type])

  const value = useMemo(
    () => ({
      model: {
        visible,
        setVisible,
        code,
        setCode,
      },
      evaluator: {
        request,
        subjectType,
        subjectInstance,
        relationType,
        objectType,
        objectInstance,
        setRequest,
        setSubjectType,
        setSubjectInstance,
        setRelationType,
        setObjectType,
        setObjectInstance,
      },
      data: {
        objectType: dataObjectType,
        setObjectType: setDataObjectType,
        subjectType: dataSubjectType,
        setSubjectType: setDataSubjectType,
        relation,
        setRelation,
        subjectRelation,
        setSubjectRelation,
        objectId,
        setObjectId,
        subjectId,
        setSubjectId,
        relationsQueryKey,
        setRelationsQueryKey,
      },
      displayState: displayState,
    }),
    [
      visible,
      setVisible,
      code,
      setCode,
      request,
      subjectType,
      subjectInstance,
      relationType,
      objectType,
      objectInstance,
      setRequest,
      setSubjectType,
      setSubjectInstance,
      setRelationType,
      setObjectType,
      setObjectInstance,
      dataObjectType,
      setDataObjectType,
      dataSubjectType,
      setDataSubjectType,
      relation,
      setRelation,
      subjectRelation,
      setSubjectRelation,
      objectId,
      subjectId,
      relationsQueryKey,
      setRelationsQueryKey,
      displayState,
    ],
  )

  return (
    <DirectoryContext.Provider value={value}>
      {children}
    </DirectoryContext.Provider>
  )
}

export default DirectoryContextProvider
