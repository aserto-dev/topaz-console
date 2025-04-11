import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { AlwaysValidValidator, Validator } from '../../../lib/validation'
import Input from '../Input'
import { UseIsNameAvailable } from '../../../lib/availability/useIsAvailable'

export type ValidatedInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'onChange'
> & {
  value?: string
  onChange: (s?: string) => void
  useIsAvailable?: UseIsNameAvailable
  onSubmit?: () => void
  validator?: Validator<string>
}

const ValidatedInput = ({
  value,
  defaultValue,
  onChange,
  useIsAvailable = () => ({
    isAvailable: true,
    reason: '',
  }),
  onSubmit = () => {},
  validator = AlwaysValidValidator,
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
