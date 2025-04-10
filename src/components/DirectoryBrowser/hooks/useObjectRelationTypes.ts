import { useMemo } from 'react'

import { useManifest } from '../../../api/directory/parsers/manifest'
import parseManifest from '../views/Model/Graph/manifestParser'

export const useObjectRelationTypes = (subjectType: string) => {
  const { data: manifest } = useManifest()

  const result: { [key: string]: Set<string> } = useMemo(() => {
    const parsedManifest = parseManifest(manifest)
    const objectType: { [key: string]: Set<string> } = {}

    parsedManifest.forEach((entry) => {
      entry.relations.forEach((relation) => {
        relation.subjects.forEach((subject) => {
          const [key] = subject.match(/:|#/g) ? subject.split(/:|#/g) : [subject]
          if (key === subjectType) {
            objectType[entry.object] = (objectType[entry.object] || new Set<string>()).add(
              relation.key
            )
          }
        })
      })
    })

    return objectType
  }, [manifest, subjectType])

  return result
}
