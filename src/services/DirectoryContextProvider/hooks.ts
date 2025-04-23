import React, { useContext } from "react";

import { QueryKey } from "@tanstack/react-query";

import { SelectOption } from "../../components/common/Select";



type DataProps = {
  objectId: string | undefined
  objectType: string | undefined
  relation: string | undefined
  relationsQueryKey: QueryKey | undefined
  setObjectId: React.Dispatch<React.SetStateAction<string | undefined>>
  setObjectType: React.Dispatch<React.SetStateAction<string | undefined>>
  setRelation: React.Dispatch<React.SetStateAction<string | undefined>>
  setRelationsQueryKey: React.Dispatch<
    React.SetStateAction<QueryKey | undefined>
  >
  setSubjectId: React.Dispatch<React.SetStateAction<string | undefined>>
  setSubjectRelation: React.Dispatch<React.SetStateAction<string | undefined>>
  setSubjectType: React.Dispatch<React.SetStateAction<string | undefined>>
  subjectId: string | undefined
  subjectRelation: string | undefined
  subjectType: string | undefined
}

type DirectoryContextProps = {
  data: DataProps
  evaluator: EvaluatorProps
  model: ModelProps
}

type EvaluatorProps = {
  objectInstance: null | SelectOption
  objectType: string
  relationType: null | SelectOption
  request: string
  setObjectInstance: React.Dispatch<React.SetStateAction<null | SelectOption>>
  setObjectType: React.Dispatch<React.SetStateAction<string>>
  setRelationType: React.Dispatch<React.SetStateAction<null | SelectOption>>
  setRequest: React.Dispatch<React.SetStateAction<string>>
  setSubjectInstance: React.Dispatch<React.SetStateAction<null | SelectOption>>
  setSubjectType: React.Dispatch<React.SetStateAction<string>>
  subjectInstance: null | SelectOption
  subjectType: string
}

type ModelProps = {
  code: string
  setCode: React.Dispatch<React.SetStateAction<string>>
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  visible: boolean
}


const useDirectoryContext = () => useContext(DirectoryContext)
export const useDirectoryModelContext = () => useDirectoryContext().model
export const useDirectoryEvaluatorContext = () =>
  useDirectoryContext().evaluator
export const useDirectoryDataContext = () => useDirectoryContext().data


export const DirectoryContext = React.createContext<DirectoryContextProps>({
  data: {
    objectId: undefined,
    objectType: undefined,
    relation: undefined,
    relationsQueryKey: undefined,
    setObjectId: () => {},
    setObjectType: () => {},
    setRelation: () => {},
    setRelationsQueryKey: () => {},
    setSubjectId: () => {},
    setSubjectRelation: () => {},
    setSubjectType: () => {},
    subjectId: undefined,
    subjectRelation: undefined,
    subjectType: undefined,
  },

  evaluator: {
    objectInstance: { label: '', value: '' },
    objectType: '',
    relationType: { label: '', value: '' },
    request: '',
    setObjectInstance: () => {},
    setObjectType: () => {},
    setRelationType: () => {},
    setRequest: () => {},
    setSubjectInstance: () => {},
    setSubjectType: () => {},
    subjectInstance: { label: '', value: '' },
    subjectType: '',
  },
  model: {
    code: '',
    setCode: () => {},
    setVisible: () => {},
    visible: false,
  },
})
