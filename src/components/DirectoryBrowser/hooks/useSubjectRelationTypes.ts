import { useMemo } from 'react'

import { useManifest } from '../../../api/directory/parsers/manifest'
import parseManifest from '../views/Model/Graph/manifestParser'

export const useSubjectRelationTypes = (objectType: string, relationKey: string) => {
  const { data: manifest } = useManifest()
  const result: { [key: string]: Set<string> } = useMemo(() => {
    const parsedManifest = parseManifest(manifest)
    const data: { [key: string]: Set<string> } = {}
    parsedManifest
      .find((entry) => entry.object === objectType)
      ?.relations?.find((relation) => relation.key === relationKey)
      ?.subjects?.forEach((subject) => {
        const [key, value] = subject.match(/:|#/g) ? subject.split(/:|#/g) : [subject]
        data[key] = data[key] || new Set<string>()
        if (value) {
          data[key].add(value)
        }
      })

    return data
  }, [manifest, objectType, relationKey])

  return result
}
