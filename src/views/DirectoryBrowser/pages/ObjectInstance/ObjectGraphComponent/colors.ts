import { theme } from '../../../../../theme'

type ColorType = {
  [key: string]: string
}
export function computeColor(s: string) {
  return colorListByType[s] || colorList[hashCode(s) % colorList.length]
}

// Predefined Aserto Object Types
const colorListByType: ColorType = {
  application: theme.indogoAccent3,
  group: theme.appleAccent3,
  identity: theme.mojoAccent3,
  resource: theme.lochivarAccent3,
  user: theme.plumAccent4,
}

// Other Object Types
const colorList = [
  theme.apple100,
  theme.appleAccent1,
  theme.berry100,
  theme.berryAccent2,
  theme.berryAccent3,
  theme.buckthorn100,
  theme.buckthornAccent1,
  theme.buckthornAccent3,
  theme.cooper100,
  theme.cooperAccent1,
  theme.cooperAccent3,
  theme.indogo100,
  theme.indogoAccent1,
  theme.lochivar100,
  theme.lochivarAccent1,
  theme.mojo100,
  theme.mojoAccent1,
]

function hashCode(s: string) {
  let hash = 0,
    i,
    chr
  if (s.length === 0) {
    return hash
  }
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash >>> 0
}
