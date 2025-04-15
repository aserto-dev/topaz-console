import { Manifest } from '../../../../../api/directory/parsers/manifest'

export type ParsedManifestData = {
  object: string
  permissions?: PermissionData[]
  relations: RelationData[]
}

type PermissionData = {
  key: string
  operator: string
  relations: Set<string>
}

type RelationData = {
  key: string
  permissions: { [key: string]: string[] }
  subjects: string[]
}

const UNION_OPERATOR = '|'
const INTERSECTION_OPERATOR = '&'
const EXCLUSION_OPERATOR = '-'
const ARROW_OPERATOR = '->'
const EQUAL_OPERATOR = '='

const handleArrowOperator = (
  block: string,
  permissionData: PermissionData[],
  permissionKey: string,
  entry: ParsedManifestData
) => {
  const [relation, permission] = block.split(ARROW_OPERATOR)

  const existingPermission = permissionData.find((perm) => perm.key === permissionKey)
  if (existingPermission) {
    existingPermission.relations.add(relation)
  } else {
    permissionData.push({
      key: permissionKey,
      operator: UNION_OPERATOR,
      relations: new Set([relation]),
    })
  }

  const existingRelation = entry.relations.find((rel) => rel.key === relation)
  if (existingRelation) {
    existingRelation.permissions[permissionKey] = existingRelation.permissions[permissionKey] || []
    existingRelation.permissions[permissionKey].push(permission)
  }
}

const parseManifest = (manifest: Manifest | undefined): ParsedManifestData[] => {
  if (!manifest?.types || typeof manifest.types === 'string') {
    return []
  }

  return Object.entries(manifest.types).map(([typeName, type]) => {
    const entry: ParsedManifestData = { object: typeName, permissions: [], relations: [] }

    // Parse relations
    const relations = type?.relations && typeof type.relations === 'object' ? type.relations : {}
    for (const [relationKey, value] of Object.entries(relations)) {
      const subjects =
        value
          ?.split(` ${UNION_OPERATOR} `)
          ?.filter((item) => item?.trim())
          ?.filter((item, index, array) => array.indexOf(item) === index) || []

      entry.relations.push({
        key: relationKey,
        permissions: {},
        subjects,
      })
    }

    // Parse permissions
    const permissions =
      type?.permissions && typeof type.permissions === 'object' ? type.permissions : {}
    const permissionData: PermissionData[] = []

    for (const [permissionKey, value] of Object.entries(permissions)) {
      if (!value) {
        continue
      }

      const processBlock = (block: string) => {
        if (block.includes(ARROW_OPERATOR)) {
          handleArrowOperator(block, permissionData, permissionKey, entry)
        } else {
          const existingPermission = permissionData.find((perm) => perm.key === permissionKey)
          if (existingPermission) {
            existingPermission.relations.add(block)
          } else {
            permissionData.push({
              key: permissionKey,
              operator: UNION_OPERATOR,
              relations: new Set([block]),
            })
          }
        }
      }

      if (value.includes(` ${UNION_OPERATOR} `)) {
        value.split(` ${UNION_OPERATOR} `).forEach(processBlock)
      } else if (value.includes(` ${INTERSECTION_OPERATOR} `)) {
        permissionData.push({
          key: permissionKey,
          operator: INTERSECTION_OPERATOR,
          relations: new Set(value.split(` ${INTERSECTION_OPERATOR} `)),
        })
      } else if (value.includes(` ${EXCLUSION_OPERATOR} `)) {
        permissionData.push({
          key: permissionKey,
          operator: EXCLUSION_OPERATOR,
          relations: new Set(value.split(` ${EXCLUSION_OPERATOR} `)),
        })
      } else if (value.includes(ARROW_OPERATOR)) {
        handleArrowOperator(value, permissionData, permissionKey, entry)
      } else {
        permissionData.push({
          key: permissionKey,
          operator: EQUAL_OPERATOR,
          relations: new Set([value]),
        })
      }
    }

    entry.permissions?.push(...permissionData)
    return entry
  })
}

export default parseManifest
