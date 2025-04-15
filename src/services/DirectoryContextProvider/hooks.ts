import React, { useContext } from "react";
import { DisplayState } from "../../components/common/EvaluateDisplayState";
import { SelectOption } from "../../components/common/Select";
import { QueryKey } from "@tanstack/react-query";

export type DisplayStateMap = Readonly<{
  canAddObject: DisplayState
  canAddRelation: DisplayState
  canDeleteDirectory: DisplayState
  canEditManifest: DisplayState
  canEditObject: DisplayState
  canRemoveRelation: DisplayState
  canAddAssertion: DisplayState
  canEditAssertion: DisplayState
  canRemoveAssertion: DisplayState
}>

type ModelProps = {
  visible: boolean
  code: string
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  setCode: React.Dispatch<React.SetStateAction<string>>
}

type EvaluatorProps = {
  request: string
  subjectType: string
  subjectInstance: SelectOption | null
  relationType: SelectOption | null
  objectType: string
  objectInstance: SelectOption | null
  setRequest: React.Dispatch<React.SetStateAction<string>>
  setSubjectType: React.Dispatch<React.SetStateAction<string>>
  setSubjectInstance: React.Dispatch<React.SetStateAction<SelectOption | null>>
  setRelationType: React.Dispatch<React.SetStateAction<SelectOption | null>>
  setObjectType: React.Dispatch<React.SetStateAction<string>>
  setObjectInstance: React.Dispatch<React.SetStateAction<SelectOption | null>>
}

type DataProps = {
  objectType: string | undefined
  setObjectType: React.Dispatch<React.SetStateAction<string | undefined>>
  subjectType: string | undefined
  setSubjectType: React.Dispatch<React.SetStateAction<string | undefined>>
  relation: string | undefined
  setRelation: React.Dispatch<React.SetStateAction<string | undefined>>
  subjectRelation: string | undefined
  setSubjectRelation: React.Dispatch<React.SetStateAction<string | undefined>>
  objectId: string | undefined
  setObjectId: React.Dispatch<React.SetStateAction<string | undefined>>
  subjectId: string | undefined
  setSubjectId: React.Dispatch<React.SetStateAction<string | undefined>>
  relationsQueryKey: QueryKey | undefined
  setRelationsQueryKey: React.Dispatch<
    React.SetStateAction<QueryKey | undefined>
  >
}

type DirectoryContextProps = {
  model: ModelProps
  evaluator: EvaluatorProps
  data: DataProps
  displayState: DisplayStateMap
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
  model: {
    visible: false,
    code: '',
    setVisible: () => {},
    setCode: () => {},
  },
  evaluator: {
    request: '',
    subjectType: '',
    subjectInstance: { label: '', value: '' },
    relationType: { label: '', value: '' },
    objectType: '',
    objectInstance: { label: '', value: '' },
    setRequest: () => {},
    setSubjectType: () => {},
    setSubjectInstance: () => {},
    setRelationType: () => {},
    setObjectType: () => {},
    setObjectInstance: () => {},
  },
  data: {
    objectType: undefined,
    setObjectType: () => {},
    subjectType: undefined,
    setSubjectType: () => {},
    relation: undefined,
    setRelation: () => {},
    subjectRelation: undefined,
    setSubjectRelation: () => {},
    objectId: undefined,
    setObjectId: () => {},
    subjectId: undefined,
    setSubjectId: () => {},
    relationsQueryKey: undefined,
    setRelationsQueryKey: () => {},
  },
  displayState: {
    canAddObject: DEFAULT_STATE,
    canAddRelation: DEFAULT_STATE,
    canDeleteDirectory: DEFAULT_STATE,
    canEditManifest: DEFAULT_STATE,
    canEditObject: DEFAULT_STATE,
    canRemoveRelation: DEFAULT_STATE,
    canAddAssertion: DEFAULT_STATE,
    canRemoveAssertion: DEFAULT_STATE,
    canEditAssertion: DEFAULT_STATE,
  },
})
