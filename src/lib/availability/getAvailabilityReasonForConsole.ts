const getAvailabilityReasonForConsole = (serviceReason: string | undefined): string => {
  if (!serviceReason) {
    return ''
  } else if (
    serviceReason.indexOf(' is invalid. It must validate regex: ^[a-z][a-z0-9\\-]{3,29}$') > 0
  ) {
    return 'Start with a letter. Must be 4 to 30 lowercase alphanumeric characters or dashes.'
  } else if (serviceReason === 'repository name already exists') {
    return 'That name is already in use.'
  } else {
    return serviceReason
  }
}

export default getAvailabilityReasonForConsole
