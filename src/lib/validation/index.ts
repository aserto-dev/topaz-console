export type Validity = 'VALID' | 'VALID_FRAGMENT' | 'INVALID'

export interface Validator<T> {
  getValidityOf: (input: T) => Validity
  isValid: (input: T) => boolean
  ruleText: string
}

export const AlwaysValidValidator: Validator<string> = {
  getValidityOf: () => 'VALID',
  isValid: () => true,
  ruleText: '',
}

export const IdValidator: Validator<string> = {
  isValid: (s) => isValidId(s),
  getValidityOf: (s) => (isValidId(s) ? 'VALID' : 'INVALID'),
  ruleText: 'Must be at most 256 characters and cannot contain whitespaces',
}

const isValidId = (value: string): boolean => {
  // a string of maximum 256 characters consisting only of non-whitespaces
  const regex = /^\S{1,256}$/
  return regex.test(value)
}

export const DisplayNameValidator: Validator<string> = {
  isValid: (s) => isValidDisplayName(s),
  getValidityOf: (s) => (isValidDisplayName(s) ? 'VALID' : 'INVALID'),
  ruleText: 'Must not contain angled brackets, ampersands, or double quotes',
}

const isValidDisplayName = (s: string): boolean => {
  const regex = /[<&">]/
  return !regex.test(s)
}
