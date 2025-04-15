import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { UseIsNameAvailable } from '../../../lib/availability/useIsAvailable'
import { AlwaysValidValidator, Validator } from '../../../lib/validation'
import Input from '../Input'

type ValidatedInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'onChange'
> & {
  onChange: (s?: string) => void
  onSubmit?: () => void
  useIsAvailable?: UseIsNameAvailable
  validator?: Validator<string>
  value?: string
}

const ValidatedInput = ({
  defaultValue,
  onChange,
  onSubmit = () => {},
  useIsAvailable = () => ({
    isAvailable: true,
    reason: '',
  }),
  validator = AlwaysValidValidator,
  value,
  ...props
}: ValidatedInputProps) => {
  const onKeyPress = useCallback(
    (target: React.KeyboardEvent) => {
      const pressedEnter = target.key === 'Enter'
      if (pressedEnter) {
        onSubmit?.()
      }
    },
    [onSubmit],
  )

  const [displayedValue, setDisplayedValue] = useState<string>('')
  const [outputValue, setOutputValue] = useState<string | undefined>('')
  const { isAvailable, reason } = useIsAvailable(
    displayedValue,
    defaultValue as string,
  )
  const isValid = useMemo(
    () => validator?.isValid(displayedValue),
    [validator, displayedValue],
  )

  useEffect(() => {
    if (value !== undefined) {
      setDisplayedValue(value)
    }
  }, [value])

  useEffect(() => {
    if (isValid && isAvailable) {
      setOutputValue(displayedValue)
    } else {
      setOutputValue(undefined)
    }
  }, [isValid, displayedValue, isAvailable, validator.ruleText])

  useEffect(() => {
    onChange(outputValue)
  }, [onChange, outputValue])

  const error = useMemo(() => {
    if (!isValid && !!displayedValue) {
      return validator.ruleText
    } else if (!isAvailable) {
      return reason || 'That name is already in use.'
    } else {
      return ''
    }
  }, [isAvailable, isValid, validator.ruleText, displayedValue, reason])

  return (
    <Input
      data-testid="input"
      error={error}
      info={validator.ruleText}
      isUnavailable={!isAvailable}
      value={displayedValue}
      onChange={(c) => setDisplayedValue(c.target.value)}
      onKeyPress={onKeyPress}
      {...props}
    />
  )
}

export default ValidatedInput
