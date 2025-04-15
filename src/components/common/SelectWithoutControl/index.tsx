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

export type ReactSelectElement = SelectInstance<SelectOption>

export type SelectOption = {
  label: string
  onClick?: () => void
  onMouseOut?: () => void
  shouldStopPropagation?: boolean
  value: number | string
}

export interface SelectWithoutControlProps
  extends Omit<
    Props<SelectOption, false>,
    | 'closeMenuOnSelect'
    | 'components'
    | 'formatGroupId'
    | 'inputId'
    | 'isClearable'
    | 'isDisabled'
    | 'isSearchable'
    | 'menuIsOpen'
    | 'onBlur'
    | 'onFocus'
    | 'styles'
  > {
  defaultValue?: SelectOption
  disabled?: boolean
  disableLabel?: boolean
  label?: string
  onBlur?: (firstSelectedOption?: SelectOption) => void
  onChange?: (value: null | SelectOption) => void
  removeTenantText?: string
  shouldDisableOptions?: boolean
  style?: React.CSSProperties
  value?: null | SelectOption
}

const groupLabelStyle = {
  backgroundColor: theme.grey,
  height: 1,
  marginBottom: -3,
  marginLeft: -11,
  marginRight: -11,
  marginTop: -8,
  position: 'relative' as const,
}

const formatGroupLabel = () => <div style={groupLabelStyle} />

const SelectWithoutControl: React.ForwardRefExoticComponent<
  React.RefAttributes<ReactSelectElement> & SelectWithoutControlProps
> = React.forwardRef(
  (
    {
      defaultValue,
      disabled,
      disableLabel,
      label,
      name,
      onBlur,
      onChange,
      options,
      shouldDisableOptions,
      style,
      ...props
    },
    ref,
  ) => {
    const [firstSelectedOption, setFirstSelectedOption] =
      useState<null | SelectOption>(null)
    const removeFocusBox = {
      boxShadow: 'none',
      outline: 'none',
      webkitBoxShadow: 'none',
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
          ':hover': {
            ...styles[':hover'],
            backgroundColor: theme.grey10,
            borderColor: theme.indogoAccent1,
            color: theme.grey100,
          },
          backgroundColor: 'transparent',
          border: 'none',
          borderWidth: 1,
          boxShadow: 'none',
          color: theme.grey70,
          marginLeft: -20,
          marginTop: -4,
          opacity: isDisabled ? 0.6 : 1,
          outline: isFocused ? 'none' : '',
          width: 120,
        }
      },
      dropdownIndicator: (styles, { isDisabled }) => ({
        ...styles,
        color: isDisabled ? theme.grey40 : theme.grey70,
        paddingRight: 22,
      }),
      group: (styles) => {
        return {
          ...styles,
          paddingBottom: 0,
        }
      },
      indicatorSeparator: (styles) => ({
        ...styles,
        display: 'none',
      }),
      input: (styles) => {
        return {
          ...styles,
          borderColor: theme.grey60,
          color: theme.grey100,
        }
      },
      menu: (styles) => ({
        ...styles,
        backgroundColor: theme.primaryBlack,
        marginTop: -5,
        width: 250,
        zIndex: 6,
      }),
      menuList: (style) => ({
        ...style,
        borderRadius: 6,
        zIndex: 5,
      }),
      option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          ':active': {
            ...styles[':active'],
            backgroundColor: theme.grey30,
          },
          backgroundColor: isDisabled
            ? theme.grey20
            : isFocused
              ? theme.grey30
              : isSelected
                ? theme.grey20
                : theme.grey20,
          borderLeft: isSelected ? `5px solid ${theme.indogoAccent3}` : '',
          color: isFocused ? theme.grey100 : theme.grey70,
          cursor: isDisabled ? 'not-allowed' : 'default',
          fontSize: 14,
          height: 36,
        }
      },
      placeholder: (styles, { isDisabled }) => ({
        ...styles,
        color: isDisabled ? theme.grey40 : theme.grey90,
      }),
      singleValue: (styles, { isDisabled }) => ({
        ...styles,
        color: isDisabled ? theme.grey40 : theme.grey100,
        overflow: 'auto',
        textAlign: 'left',
        width: '100%',
        ...removeFocusBox,
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
