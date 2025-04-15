export interface Validator<T> {
  getValidityOf: (input: T) => Validity
  isValid: (input: T) => boolean
  ruleText: string
}

export type Validity = 'INVALID' | 'VALID' | 'VALID_FRAGMENT'

export const AlwaysValidValidator: Validator<string> = {
  getValidityOf: () => 'VALID',
  isValid: () => true,
  ruleText: '',
}

export const IdValidator: Validator<string> = {
  getValidityOf: (s) => (isValidId(s) ? 'VALID' : 'INVALID'),
  isValid: (s) => isValidId(s),
  ruleText: 'Must be at most 256 characters and cannot contain whitespaces',
}

const isValidId = (value: string): boolean => {
  // a string of maximum 256 characters consisting only of non-whitespaces
  const regex = /^\S{1,256}$/
  return regex.test(value)
}

export const DisplayNameValidator: Validator<string> = {
  getValidityOf: (s) => (isValidDisplayName(s) ? 'VALID' : 'INVALID'),
  isValid: (s) => isValidDisplayName(s),
  ruleText: 'Must not contain angled brackets, ampersands, or double quotes',
}

const isValidDisplayName = (s: string): boolean => {
  const regex = /[<&">]/
  return !regex.test(s)
}
