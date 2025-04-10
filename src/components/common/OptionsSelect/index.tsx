import React, { useCallback, useEffect, useState } from 'react'
import ReactSelect, {
  components,
  DropdownIndicatorProps,
  OptionProps,
  StylesConfig,
} from 'react-select'

import arrow from '../../../assets/arrow_down.svg'
import { theme } from '../../../theme'
import Label from '../Label'
import {
  ReactSelectElement,
  SelectOption,
  SelectWithoutControlProps,
} from '../SelectWithoutControl'

const groupLabelStyle = {
  position: 'relative' as const,
  marginTop: -8,
  marginBottom: -3,
  marginLeft: -11,
  marginRight: -11,
  backgroundColor: theme.grey,
}

const formatGroupLabel = () => <div style={groupLabelStyle} />

const OptionsSelect: React.ForwardRefExoticComponent<
  SelectWithoutControlProps &
    React.RefAttributes<ReactSelectElement> & {
      modifyCustomStyle?: (
        styles: StylesConfig<SelectOption, false>,
      ) => StylesConfig<SelectOption, false>
    }
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
      modifyCustomStyle,
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
    const DropdownIndicator = (
      props: DropdownIndicatorProps<SelectOption, false>,
    ) => {
      return (
        <components.DropdownIndicator {...props}>
          <img alt="dropdown" src={arrow} />
        </components.DropdownIndicator>
      )
    }
    const colourStyles: StylesConfig<SelectOption, false> = {
      control: (styles, { isDisabled, isFocused }) => {
        return {
          ...styles,
          width: 93,
          height: 36,
          backgroundColor: isFocused ? theme.grey40 : theme.grey20,
          border: `1px solid ${theme.grey30}`,
          color: theme.grey70,
          opacity: isDisabled ? 0.6 : 1,
          outline: isFocused ? 'none' : '',
          boxShadow: 'none',
          borderWidth: 1,
          ':hover': {
            ...styles[':hover'],
            backgroundColor: theme.grey40,
            borderColor: theme.grey40,
          },
        }
      },
      option: (styles, { isDisabled, isFocused }) => {
        return {
          ...styles,
          backgroundColor: isFocused ? theme.grey40 : theme.grey20,
          color: isFocused ? theme.grey100 : theme.grey70,
          height: 36,
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
          backgroundColor: theme.grey30,
          paddingBottom: 0,
          paddingTop: 6,
        }
      },
      input: (styles) => {
        return {
          ...styles,
          color: theme.grey100,
        }
      },
      placeholder: (styles) => ({
        ...styles,
        color: theme.grey100,
        fontWeight: '600',
        width: 10,
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
        zIndex: 0,
        marginTop: 3,
        backgroundColor: 'none',
        marginLeft: -155,
      }),
      dropdownIndicator: (styles) => ({
        ...styles,
        padding: 0,
        width: 25,
        color: theme.grey100,
        ':hover': {
          ...styles[':hover'],
          color: theme.grey100,
        },
      }),
      menuList: (style) => ({
        ...style,
        zIndex: -10,
        padding: 0,
        border: `1px solid ${theme.grey60}`,
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
          components={{ Option, DropdownIndicator }}
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
          styles={
            modifyCustomStyle ? modifyCustomStyle(colourStyles) : colourStyles
          }
          onBlur={() => {
            onBlur?.(firstSelectedOption || undefined)
          }}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation()
              e.preventDefault()
            }
          }}
        />
      </div>
    )
  },
)
export default OptionsSelect
