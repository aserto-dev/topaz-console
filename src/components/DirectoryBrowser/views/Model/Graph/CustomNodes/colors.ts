import { theme } from '../../../../../../theme'

type ColorType = {
  [key: string]: {
    backgroundColor: string
    borderColor: string
  }
}
export function computeColor(s: string) {
  return colorListByType[s]
}

// Predefined Object Types
const colorListByType: ColorType = {
  object: {
    backgroundColor: theme.cooperAccent1,
    borderColor: theme.cooperAccent3,
  },
  subject: {
    backgroundColor: theme.cooperAccent1,
    borderColor: theme.cooperAccent3,
  },
  relation: {
    backgroundColor: theme.indogoAccent1,
    borderColor: theme.indogoAccent3,
  },
  permission: {
    backgroundColor: theme.plumAccent1,
    borderColor: theme.plumAccent3,
  },
  operator: {
    backgroundColor: theme.appleAccent1,
    borderColor: theme.appleAccent3,
  },
}
