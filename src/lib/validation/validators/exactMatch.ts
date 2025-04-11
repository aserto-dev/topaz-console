import { Validator, Validity } from ".."

export const createExactMatchValidator = (expectedName: string): Validator<string> => {
  const getValidityOf = (name: string): Validity => {
    if (name === expectedName) {
      return 'VALID'
    }
    return 'INVALID'
  }
  return {
    getValidityOf: getValidityOf,
    isValid: (name: string) => getValidityOf(name) === 'VALID',
    ruleText: '',
  }
}
