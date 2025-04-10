import { useMemo } from 'react'
import { Alias, Document, ParsedNode, parseDocument, Scalar, YAMLMap, YAMLSeq } from 'yaml'

import { useDirectoryV3ManifestGet } from '../../v3/directory'
import { ObjectType, Permission, RelationType } from '../types'

const DISPLAY_NAME_REGEX = /^(## )(display_name: )(.*)( ###)/

type ManifestObjectType = {
  displayName: string
  relations: Record<string, string>
  permissions: Record<string, string>
}

export type Manifest = {
  model: {
    version: number
  }
  types: Record<string, ManifestObjectType>
}

type ObjectDisplayName = { [key: string]: string }

export const useManifestData = () => {
  return useDirectoryV3ManifestGet<string>()
}

export const useManifest = () => {
  const { data: manifest, ...all } = useManifestData()
  const manifestData: Manifest | undefined = useMemo(() => {
    if (!manifest) {
      return undefined
    }
    try {
      const doc = parseDocument(manifest)
      const displayNames = parseDisplayNames(doc)

      const manifestData: Manifest = doc.toJSON()
      Object.entries(manifestData.types).forEach(([type, typeData]) => {
        if (typeData !== null) {
          typeData.displayName = displayNames[type] || type
        } else {
          manifestData.types[type] = {
            displayName: displayNames[type] || type,
            relations: {},
            permissions: {},
          }
        }
      })
      return manifestData
    } catch {
      return undefined
    }
  }, [manifest])

  return { data: manifestData, ...all }
}

export const useManifestToYaml = (manifest: string) => {
  const manifestData: Manifest | undefined = useMemo(() => {
    try {
      const doc = parseDocument(manifest)
      return doc.toJSON()
    } catch { /* empty */ }
  }, [manifest])
  return manifestData
}

export const useParsedManifest = () => {
  const { data: manifest, ...all } = useManifest()

  const parsedObjectTypes: ObjectType[] = useMemo(() => {
    const types = manifest?.types || {}
    return Object.keys(types).map((objectType) => {
      return {
        name: objectType,
        displayName: types[objectType]?.displayName || objectType,
      }
    })
  }, [manifest?.types])

  const parsedRelationTypes: RelationType[] = useMemo(() => {
    return parsedObjectTypes.flatMap((objectType) => {
      const objectTypeName = objectType.name
      const relationNames = Object.keys(manifest?.types?.[objectTypeName]?.relations || [])
      return relationNames.map((relationName) => ({
        name: relationName,
        objectType: objectTypeName,
        displayName: relationName,
      }))
    })
  }, [parsedObjectTypes, manifest?.types])

  const parsedPermissions: Permission[] = useMemo(() => {
    return parsedObjectTypes.flatMap((objectType) => {
      const objectTypeName = objectType.name
      const permissionNames = Object.keys(manifest?.types?.[objectTypeName]?.permissions || [])
      return permissionNames.map((permissionName) => ({
        name: permissionName,
        objectType: objectTypeName,
        displayName: permissionName,
      }))
    })
  }, [parsedObjectTypes, manifest?.types])

  return {
    objectTypes: parsedObjectTypes,
    relationTypes: parsedRelationTypes,
    permissions: parsedPermissions,
    ...all,
  }
}

export const useLegacyIdentities = (): boolean => {
  const { relationTypes } = useParsedManifest()
  return useMemo(() => {
    if (relationTypes.length === 0) {
      return false
    }
    return (
      relationTypes.find(
        (relation: RelationType) =>
          relation.objectType === 'identity' && relation.name === 'identifier'
      ) !== undefined
    )
  }, [relationTypes])
}

const parseDisplayNames = (
  doc:
    | Document.Parsed<Alias.Parsed, true>
    | Document.Parsed<Scalar.Parsed, true>
    | Document.Parsed<YAMLMap.Parsed<ParsedNode, ParsedNode | null>, true>
    | Document.Parsed<YAMLSeq.Parsed<ParsedNode>, true>
): ObjectDisplayName => {
  const displayNames: ObjectDisplayName = {}

  const contents = doc.contents as YAMLMap<Scalar, YAMLMap<Scalar, Scalar>>
  if (!contents) {
    return displayNames
  }

  const types = contents.items.find((i) => i.key.value === 'types')
  if (!types) {
    return displayNames
  }

  const extractDisplayName = (comment: string) => {
    const parts = DISPLAY_NAME_REGEX.exec(comment) || []
    return parts.length >= 3 ? parts[3] : undefined
  }

  const mainComment = extractDisplayName(types.value?.commentBefore || '')
  if (mainComment) {
    displayNames[String(types.value?.items?.[0]?.key?.value)] = mainComment
  }

  types.value?.items.forEach((item) => {
    const comments = (item.key.commentBefore || '').split('\n')
    comments.forEach((comment) => {
      const displayName = extractDisplayName(comment)
      if (displayName) {
        displayNames[String(item.key.value)] = displayName
      }
    })
  })

  return displayNames
}
