import { Node } from 'reactflow'

import { ParsedManifestData } from './manifestParser'

const mapNodePath = (parsedManifest: ParsedManifestData[]) => {
  const dataMap = new Map(parsedManifest.map((data) => [data.object, data]))

  return (node: Node) => {
    const nodes: string[] = []
    const nodeType = node.type || ''
    const object = node.data.context
    let target = node.id.split(`${object}-`)[1]
    const data = dataMap.get(object)
    let relations = data?.relations || []
    let permissions = data?.permissions || []

    if (nodeType === 'subject') {
      target = target.replace('-subject', '')
      relations = relations.filter((relation) => relation.subjects.includes(target))
    }

    if (['object', 'subject', 'permission'].includes(nodeType)) {
      if (['object', 'subject'].includes(nodeType)) {
        nodes.push(`${object}-object`)
        relations.forEach((relation) => {
          nodes.push(`${object}-${relation.key}`)

          if (nodeType === 'subject') {
            nodes.push(`${object}-${target}-subject`)
          } else {
            relation.subjects.forEach((subject) => {
              nodes.push(`${object}-${subject}-subject`)
            })
          }
        })
      }
      if (nodeType === 'permission') {
        permissions = data?.permissions?.filter((permission) => permission.key === target) || []
      }

      permissions.forEach((permission) => {
        nodes.push(`${object}-${permission.key}`)
        nodes.push(`${object}-${permission.key}-${permission.operator}`)
        permission.relations.forEach((relation) => {
          const relationData = relations.find((relationData) => relationData.key === relation)
          if (relationData) {
            const newPermData = relationData.permissions[permission.key]
            if (newPermData && newPermData.length > 0) {
              relationData.subjects.forEach((subject) => {
                const subjectData = dataMap.get(subject)
                const subjectRelation = subjectData?.permissions?.find(
                  (perm) => perm.key === permission.key
                )

                nodes.push(`${subject}-${permission.key}`)
                nodes.push(`${subject}-${permission.key}-${permission.operator}`)
                subjectRelation?.relations?.forEach((relation) => {
                  nodes.push(`${subject}-${relation}`)
                })
                if (nodeType === 'permission') {
                  newPermData.forEach((perm) => {
                    nodes.push(`${subject}-${perm}`)
                  })
                }
              })
            } else {
              const permissionData = relationData.permissions[permission.key] || []
              relationData.subjects.forEach((subject) => {
                nodes.push(`${subject}-${relation}`)
                permissionData.forEach((perm) => {
                  nodes.push(`${subject}-${perm}`)
                  nodes.push(`${subject}-${perm}-${permission.operator}`)
                })
              })
            }
          }
          nodes.push(`${object}-${relation}`)
        })
      })
    }

    if (nodeType === 'relation') {
      const permissions =
        data?.permissions?.filter((permission) => permission.relations.has(target)) || []

      if (permissions.length > 0) {
        permissions.forEach((permission) => {
          nodes.push(`${object}-${permission.key}`)
          nodes.push(`${object}-${permission.key}-${permission.operator}`)
        })
      } else {
        const relationData = relations.find((relationData) => relationData.key === target)
        if (relationData) {
          relationData.subjects.forEach((subject) => {
            nodes.push(`${object}-${subject}-subject`)
          })
        }
        nodes.push(`${object}-${target}`)
        nodes.push(`${object}-object`)
      }
    }

    if (nodeType === 'operator') {
      const permissionKey = node.data.permission
      const operator = target.replace(`${permissionKey}-`, '')

      nodes.push(`${object}-${permissionKey}-${operator}`)
      permissions
        .filter(
          (permission) => permission.operator === operator && permission.key === permissionKey
        )
        .forEach((permission) => {
          nodes.push(`${object}-${permission.key}`)
          permission.relations.forEach((relation) => {
            nodes.push(`${object}-${relation}`)
          })
        })
    }

    return nodes
  }
}

export default mapNodePath
