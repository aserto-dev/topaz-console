export type ObjectType = {
  displayName: string
  name: string
}

export type Permission = {
  displayName: string
  name: string
  objectType: string
}

export type RelationType = {
  displayName: string
  name: string
  objectType: string
}

export type V3GetObjectTypesResponse = {
  results: ObjectType[] | undefined
}

export type V3GetPermissionsResponse = {
  results: Permission[] | undefined
}

export type V3GetRelationTypesResponse = {
  results: RelationType[] | undefined
}

// // Request
export type V3ObjectTypesListRequest = {
  name?: string
}

export type V3PermissionsListRequest = {
  name?: string
  objectType?: string
}

export type V3RelationTypesListRequest = {
  name?: string
  objectType?: string
}
