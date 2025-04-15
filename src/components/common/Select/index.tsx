import React, { useCallback } from 'react'
import ReactSelect, {
  components,
  OptionProps,
  Props,
  SelectInstance,
  StylesConfig,
} from 'react-select'

import Label from '../Label'
import { colourStyles, formatGroupLabel } from './colourStyles'

export type SelectOption = {
  value: string | number
  label: string
  shouldStopPropagation?: boolean
  onClick?: () => void
}

type ReactSelectElement = SelectInstance<SelectOption>

interface SelectProps
  extends Omit<
    Props<SelectOption, false>,
    'isDisabled' | 'inputId' | 'styles' | 'formatGroupId' | 'components'
  > {
  defaultValue?: SelectOption
  disabled?: boolean
  label?: string
  value?: SelectOption | null
  style?: React.CSSProperties
  modifyCustomStyle?: (
    styles: StylesConfig<SelectOption, false>,
  ) => StylesConfig<SelectOption, false>
  disableLabel?: boolean
}

const Select: React.ForwardRefExoticComponent<
  SelectProps & React.RefAttributes<ReactSelectElement>
> = React.forwardRef(
  (
    {
      onChange,
      label,
      disabled,
      style,
      value,
      disableLabel,
      name,
      modifyCustomStyle,
      ...props
    },
    ref,
  ) => {
    const Option = useCallback((props: OptionProps<SelectOption, false>) => {
      return (
        <div>
          <components.Option
            {...props}
            innerProps={{
              ...props.innerProps,
              onMouseDown: (e) => {
                if (props.data.shouldStopPropagation) {
                  e.stopPropagation()
                  props.data?.onClick?.()
                }
              },
            }}
          />
        </div>
      )
    }, [])

    return (
      <div style={style}>
        {label && (
          <Label disabled={disableLabel} htmlFor={name}>
            {label}
          </Label>
        )}
        <ReactSelect
          ref={ref}
          formatGroupLabel={formatGroupLabel}
          inputId={name}
          isDisabled={disabled}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
          components={{ Option }}
          menuShouldScrollIntoView={false}
          styles={
            modifyCustomStyle ? modifyCustomStyle(colourStyles) : colourStyles
          }
        />
      </div>
    )
  },
)
export default Select
