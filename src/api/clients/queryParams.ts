export type QueryParams = Nested<Record<string, string>> | Record<string, string>

type Nested<T> = {
  [P in keyof T]: boolean | number | Record<string, string> | string | unknown
}

export const flatten = (
  input: Nested<Record<string, string>> | Record<string, string>
): Record<string, string>  => {
  const flat: Record<string, string> = {}
  for (const k in input) {
    const value = input[k]
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const temp = flatten(value as Nested<Record<string, string>> | Record<string, string>)
      for (const j in temp) {
        flat[k + '.' + j] = temp[j]
      }
    } else {
      flat[k] = value as string
    }
  }

  return flat
}
