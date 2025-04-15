import React, { useContext } from "react";

import { QueryKey } from "@tanstack/react-query";

import { DisplayState } from "../../components/common/EvaluateDisplayState";
import { SelectOption } from "../../components/common/Select";

export type DisplayStateMap = Readonly<{
  canAddAssertion: DisplayState
  canAddObject: DisplayState
  canAddRelation: DisplayState
  canDeleteDirectory: DisplayState
  canEditAssertion: DisplayState
  canEditManifest: DisplayState
  canEditObject: DisplayState
  canRemoveAssertion: DisplayState
  canRemoveRelation: DisplayState
}>

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
  displayState: DisplayStateMap
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

const DEFAULT_STATE = {
  enabled: false,
  visible: true,
} as const

const useDirectoryContext = () => useContext(DirectoryContext)
export const useDirectoryModelContext = () => useDirectoryContext().model
export const useDirectoryEvaluatorContext = () =>
  useDirectoryContext().evaluator
export const useDirectoryDataContext = () => useDirectoryContext().data
export const useDirectoryDisplayState = () => useDirectoryContext().displayState


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
  displayState: {
    canAddAssertion: DEFAULT_STATE,
    canAddObject: DEFAULT_STATE,
    canAddRelation: DEFAULT_STATE,
    canDeleteDirectory: DEFAULT_STATE,
    canEditAssertion: DEFAULT_STATE,
    canEditManifest: DEFAULT_STATE,
    canEditObject: DEFAULT_STATE,
    canRemoveAssertion: DEFAULT_STATE,
    canRemoveRelation: DEFAULT_STATE,
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
