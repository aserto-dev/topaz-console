import { UseQueryResult } from "@tanstack/react-query";
import { RpcStatus, V3CheckResponse } from "../../types/directory";

export type ObjectType = {
  name: string
  displayName: string
}

export type RelationType = {
  name: string
  objectType: string
  displayName: string
}

export type Permission = {
  name: string
  objectType: string
  displayName: string
}

export type V3GetPermissionsResponse = {
  results: Permission[] | undefined
}

export type V3GetRelationTypesResponse = {
  results: RelationType[] | undefined
}

export type V3GetObjectTypesResponse = {
  results: ObjectType[] | undefined
}

// // Request
export type V3ObjectTypesListRequest = {
  name?: string
}

export type V3RelationTypesListRequest = {
  name?: string
  objectType?: string
}

export type V3PermissionsListRequest = {
  name?: string
  objectType?: string
}

export type CheckResult = UseQueryResult<V3CheckResponse, RpcStatus>
