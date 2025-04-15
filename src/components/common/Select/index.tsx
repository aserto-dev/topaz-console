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
  label: string
  onClick?: () => void
  shouldStopPropagation?: boolean
  value: number | string
}

type ReactSelectElement = SelectInstance<SelectOption>

interface SelectProps
  extends Omit<
    Props<SelectOption, false>,
    'components' | 'formatGroupId' | 'inputId' | 'isDisabled' | 'styles'
  > {
  defaultValue?: SelectOption
  disabled?: boolean
  disableLabel?: boolean
  label?: string
  modifyCustomStyle?: (
    styles: StylesConfig<SelectOption, false>,
  ) => StylesConfig<SelectOption, false>
  style?: React.CSSProperties
  value?: null | SelectOption
}

const Select: React.ForwardRefExoticComponent<
  React.RefAttributes<ReactSelectElement> & SelectProps
> = React.forwardRef(
  (
    {
      disabled,
      disableLabel,
      label,
      modifyCustomStyle,
      name,
      onChange,
      style,
      value,
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
