/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { QueryKey } from "@tanstack/react-query";

import { DisplayState } from "../../components/common/EvaluateDisplayState";
import { SelectOption } from "../../components/common/Select";
import { V3CheckRequest } from "../../types/directory";
import { useDirectoryReaderV3ObjectGet } from "../../api/v3/directory";

export type DisplayStateMap = Readonly<{
  canAddObject: DisplayState;
  canAddRelation: DisplayState;
  canDeleteDirectory: DisplayState;
  canEditManifest: DisplayState;
  canEditObject: DisplayState;
  canRemoveRelation: DisplayState;
  canAddAssertion: DisplayState;
  canEditAssertion: DisplayState;
  canRemoveAssertion: DisplayState;
}>;

type ModelProps = {
  visible: boolean;
  code: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
};

type EvaluatorProps = {
  request: string;
  subjectType: string;
  subjectInstance: SelectOption | null;
  relationType: SelectOption | null;
  objectType: string;
  objectInstance: SelectOption | null;
  setRequest: React.Dispatch<React.SetStateAction<string>>;
  setSubjectType: React.Dispatch<React.SetStateAction<string>>;
  setSubjectInstance: React.Dispatch<React.SetStateAction<SelectOption | null>>;
  setRelationType: React.Dispatch<React.SetStateAction<SelectOption | null>>;
  setObjectType: React.Dispatch<React.SetStateAction<string>>;
  setObjectInstance: React.Dispatch<React.SetStateAction<SelectOption | null>>;
};

type DataProps = {
  objectType: string | undefined;
  setObjectType: React.Dispatch<React.SetStateAction<string | undefined>>;
  subjectType: string | undefined;
  setSubjectType: React.Dispatch<React.SetStateAction<string | undefined>>;
  relation: string | undefined;
  setRelation: React.Dispatch<React.SetStateAction<string | undefined>>;
  objectIdPart: string | undefined;
  setObjectIdPart: React.Dispatch<React.SetStateAction<string | undefined>>;
  subjectIdPart: string | undefined;
  setSubjectIdPart: React.Dispatch<React.SetStateAction<string | undefined>>;
  subjectRelation: string | undefined;
  setSubjectRelation: React.Dispatch<React.SetStateAction<string | undefined>>;
  objectId: string | undefined;
  setObjectId: React.Dispatch<React.SetStateAction<string | undefined>>;
  subjectId: string | undefined;
  setSubjectId: React.Dispatch<React.SetStateAction<string | undefined>>;
  relationsQueryKey: QueryKey | undefined;
  setRelationsQueryKey: React.Dispatch<
    React.SetStateAction<QueryKey | undefined>
  >;
};

export type DirectoryContextProps = {
  model: ModelProps;
  evaluator: EvaluatorProps;
  data: DataProps;
  displayState: DisplayStateMap;
};

const DEFAULT_STATE = {
  enabled: false,
  visible: true,
} as const;

const DirectoryContext = React.createContext<DirectoryContextProps>({
  model: {
    visible: false,
    code: "",
    setVisible: () => {},
    setCode: () => {},
  },
  evaluator: {
    request: "",
    subjectType: "",
    subjectInstance: { label: "", value: "" },
    relationType: { label: "", value: "" },
    objectType: "",
    objectInstance: { label: "", value: "" },
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
    objectIdPart: undefined,
    setObjectIdPart: () => {},
    subjectIdPart: undefined,
    setSubjectIdPart: () => {},
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
});

export const useDirectoryContext = () => useContext(DirectoryContext);
export const useDirectoryModelContext = () => useDirectoryContext().model;
export const useDirectoryEvaluatorContext = () =>
  useDirectoryContext().evaluator;
export const useDirectoryDataContext = () => useDirectoryContext().data;
export const useDirectoryDisplayState = () =>
  useDirectoryContext().displayState;

const DirectoryContextProvider = ({
  displayState,
  children,
}: {
  displayState: DisplayStateMap;
  children: React.ReactNode;
}) => {
  // model State
  const location: { state: V3CheckRequest } = useLocation();
  const {
    object_type,
    object_id,
    subject_type,
    subject_id,
    relation: check_relation,
  } = location.state || {};

  const object = useDirectoryReaderV3ObjectGet(object_type, object_id);
  const subject = useDirectoryReaderV3ObjectGet(subject_type, subject_id);

  const defaultRelationInstace = useMemo(() => {
    if (!check_relation) {
      return;
    }

    return {
      label: check_relation,
      value: check_relation,
    };
  }, [check_relation]);

  const defaultObjectInstance = useMemo(() => {
    const obj = object.data?.result;
    if (!obj) {
      return;
    }

    return {
      label: obj.display_name || obj.id,
      value: obj.id,
    };
  }, [object.data?.result]);

  const defaultSubjectInstance = useMemo(() => {
    const obj = subject.data?.result;
    if (!obj) {
      return;
    }

    return {
      label: obj.display_name || obj.id,
      value: obj.id,
    };
  }, [subject.data?.result]);

  // model
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState<string>("");
  const [request, setRequest] = useState("check");
  const [subjectType, setSubjectType] = useState("user");
  const [subjectInstance, setSubjectInstance] = useState<SelectOption | null>(
    null
  );
  const [relationType, setRelationType] = useState<SelectOption | null>(null);
  const [objectType, setObjectType] = useState("group");
  const [objectInstance, setObjectInstance] = useState<SelectOption | null>(
    null
  );

  // data
  const [dataObjectType, setDataObjectType] = useState<string | undefined>(
    undefined
  );
  const [dataSubjectType, setDataSubjectType] = useState<string | undefined>(
    undefined
  );
  const [relation, setRelation] = useState<string | undefined>(undefined);
  const [objectIdPart, setObjectIdPart] = useState<string | undefined>(
    undefined
  );
  const [subjectIdPart, setSubjectIdPart] = useState<string | undefined>(
    undefined
  );
  const [subjectRelation, setSubjectRelation] = useState<string | undefined>(
    undefined
  );
  const [relationsQueryKey, setRelationsQueryKey] = useState<
    QueryKey | undefined
  >(undefined);

  const [objectId, setObjectId] = useState<string | undefined>(undefined);
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);

  // default state
  useEffect(() => {
    defaultObjectInstance && setObjectInstance(defaultObjectInstance);
  }, [setObjectInstance, defaultObjectInstance]);

  useEffect(() => {
    defaultSubjectInstance && setSubjectInstance(defaultSubjectInstance);
  }, [setSubjectInstance, defaultSubjectInstance]);

  useEffect(() => {
    defaultRelationInstace && setRelationType(defaultRelationInstace);
  }, [setRelationType, defaultRelationInstace]);

  useEffect(() => {
    location.state !== null && setObjectType(object_type);
  }, [location.state, setObjectType, object_type]);

  useEffect(() => {
    location.state !== null && setSubjectType(subject_type);
  }, [location.state, setSubjectType, subject_type]);

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
        objectIdPart,
        setObjectIdPart,
        subjectIdPart,
        setSubjectIdPart,
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
      objectIdPart,
      setObjectIdPart,
      subjectIdPart,
      setSubjectIdPart,
      subjectRelation,
      setSubjectRelation,
      objectId,
      subjectId,
      relationsQueryKey,
      setRelationsQueryKey,
      displayState,
    ]
  );

  return (
    <DirectoryContext.Provider value={value}>
      {children}
    </DirectoryContext.Provider>
  );
};

export default DirectoryContextProvider;
