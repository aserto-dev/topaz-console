import React, { useCallback, useEffect, useState } from 'react'
import ReactSelect, {
  components,
  OptionProps,
  Props,
  SelectInstance,
  StylesConfig,
} from 'react-select'

import { theme } from '../../../theme'
import Label from '../Label'

export type SelectOption = {
  value: string | number
  label: string
  shouldStopPropagation?: boolean
  onClick?: () => void
  onMouseOut?: () => void
}

export type ReactSelectElement = SelectInstance<SelectOption>

export interface SelectWithoutControlProps
  extends Omit<
    Props<SelectOption, false>,
    | 'onFocus'
    | 'onBlur'
    | 'isDisabled'
    | 'isClearable'
    | 'isSearchable'
    | 'closeMenuOnSelect'
    | 'menuIsOpen'
    | 'inputId'
    | 'styles'
    | 'formatGroupId'
    | 'components'
  > {
  defaultValue?: SelectOption
  onChange?: (value: SelectOption | null) => void
  disabled?: boolean
  label?: string
  value?: SelectOption | null
  style?: React.CSSProperties
  disableLabel?: boolean
  shouldDisableOptions?: boolean
  removeTenantText?: string
  onBlur?: (firstSelectedOption?: SelectOption) => void
}

const groupLabelStyle = {
  position: 'relative' as const,
  marginTop: -8,
  marginBottom: -3,
  marginLeft: -11,
  marginRight: -11,
  height: 1,
  backgroundColor: theme.grey,
}

const formatGroupLabel = () => <div style={groupLabelStyle} />

const SelectWithoutControl: React.ForwardRefExoticComponent<
  SelectWithoutControlProps & React.RefAttributes<ReactSelectElement>
> = React.forwardRef(
  (
    {
      options,
      defaultValue,
      onChange,
      label,
      disabled,
      style,
      disableLabel,
      name,
      shouldDisableOptions,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [firstSelectedOption, setFirstSelectedOption] =
      useState<SelectOption | null>(null)
    const removeFocusBox = {
      outline: 'none',
      webkitBoxShadow: 'none',
      boxShadow: 'none',
    }

    useEffect(() => {
      if (defaultValue) {
        setFirstSelectedOption(defaultValue)
      }
    }, [defaultValue])

    const Option = useCallback(
      (props: OptionProps<SelectOption, false>) => {
        return (
          <div>
            <components.Option
              {...props}
              innerProps={{
                ...props.innerProps,
                onMouseDown: (e) => {
                  if (shouldDisableOptions) {
                    return
                  }
                  if (props.data.shouldStopPropagation) {
                    e.stopPropagation()
                    props.data?.onClick?.()
                  }
                },
              }}
              isDisabled={shouldDisableOptions || false}
            />
          </div>
        )
      },
      [shouldDisableOptions],
    )

    const colourStyles: StylesConfig<SelectOption, false> = {
      control: (styles, { isDisabled, isFocused }) => {
        return {
          ...styles,
          width: 120,
          marginTop: -4,
          marginLeft: -20,
          backgroundColor: 'transparent',
          color: theme.grey70,
          border: 'none',
          opacity: isDisabled ? 0.6 : 1,
          outline: isFocused ? 'none' : '',
          boxShadow: 'none',
          borderWidth: 1,
          ':hover': {
            ...styles[':hover'],
            backgroundColor: theme.grey10,
            borderColor: theme.indogoAccent1,
            color: theme.grey100,
          },
        }
      },
      option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          backgroundColor: isDisabled
            ? theme.grey20
            : isFocused
              ? theme.grey30
              : isSelected
                ? theme.grey20
                : theme.grey20,
          borderLeft: isSelected ? `5px solid ${theme.indogoAccent3}` : '',
          color: isFocused ? theme.grey100 : theme.grey70,
          height: 36,
          fontSize: 14,
          cursor: isDisabled ? 'not-allowed' : 'default',
          ':active': {
            ...styles[':active'],
            backgroundColor: theme.grey30,
          },
        }
      },
      group: (styles) => {
        return {
          ...styles,
          paddingBottom: 0,
        }
      },
      input: (styles) => {
        return {
          ...styles,
          color: theme.grey100,
          borderColor: theme.grey60,
        }
      },
      placeholder: (styles, { isDisabled }) => ({
        ...styles,
        color: isDisabled ? theme.grey40 : theme.grey90,
      }),
      singleValue: (styles, { isDisabled }) => ({
        ...styles,
        color: isDisabled ? theme.grey40 : theme.grey100,
        width: '100%',
        textAlign: 'left',
        overflow: 'auto',
        ...removeFocusBox,
      }),
      menu: (styles) => ({
        ...styles,
        width: 250,
        backgroundColor: theme.primaryBlack,
        zIndex: 6,
        marginTop: -5,
      }),
      dropdownIndicator: (styles, { isDisabled }) => ({
        ...styles,
        paddingRight: 22,
        color: isDisabled ? theme.grey40 : theme.grey70,
      }),
      menuList: (style) => ({
        ...style,
        zIndex: 5,
        borderRadius: 6,
      }),
      indicatorSeparator: (styles) => ({
        ...styles,
        display: 'none',
      }),
      valueContainer: (styles) => ({
        ...styles,
        overflow: 'none',
      }),
    }

    return (
      <div style={style}>
        {label && (
          <Label disabled={disableLabel} htmlFor={name}>
            {label}
          </Label>
        )}
        <ReactSelect
          {...props}
          ref={ref}
          closeMenuOnSelect={false}
          components={{ Option }}
          defaultValue={defaultValue}
          formatGroupLabel={formatGroupLabel}
          inputId={name}
          isClearable={false}
          isDisabled={disabled}
          isSearchable={false}
          menuPlacement="auto"
          menuPosition="fixed"
          name={name}
          options={options}
          styles={colourStyles}
          onBlur={() => {
            onBlur?.(firstSelectedOption || undefined)
          }}
          onChange={onChange}
        />
      </div>
    )
  },
)
export default SelectWithoutControl
