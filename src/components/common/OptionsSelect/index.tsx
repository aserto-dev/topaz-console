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
  backgroundColor: theme.grey,
  marginBottom: -3,
  marginLeft: -11,
  marginRight: -11,
  marginTop: -8,
  position: 'relative' as const,
}

const formatGroupLabel = () => <div style={groupLabelStyle} />

const OptionsSelect: React.ForwardRefExoticComponent<
  React.RefAttributes<ReactSelectElement> &
    SelectWithoutControlProps & {
      modifyCustomStyle?: (
        styles: StylesConfig<SelectOption, false>,
      ) => StylesConfig<SelectOption, false>
    }
> = React.forwardRef(
  (
    {
      defaultValue,
      disabled,
      disableLabel,
      label,
      modifyCustomStyle,
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
          ':hover': {
            ...styles[':hover'],
            backgroundColor: theme.grey40,
            borderColor: theme.grey40,
          },
          backgroundColor: isFocused ? theme.grey40 : theme.grey20,
          border: `1px solid ${theme.grey30}`,
          borderWidth: 1,
          boxShadow: 'none',
          color: theme.grey70,
          height: 36,
          opacity: isDisabled ? 0.6 : 1,
          outline: isFocused ? 'none' : '',
          width: 93,
        }
      },
      dropdownIndicator: (styles) => ({
        ...styles,
        ':hover': {
          ...styles[':hover'],
          color: theme.grey100,
        },
        color: theme.grey100,
        padding: 0,
        width: 25,
      }),
      group: (styles) => {
        return {
          ...styles,
          backgroundColor: theme.grey30,
          paddingBottom: 0,
          paddingTop: 6,
        }
      },
      indicatorSeparator: (styles) => ({
        ...styles,
        display: 'none',
      }),
      input: (styles) => {
        return {
          ...styles,
          color: theme.grey100,
        }
      },
      menu: (styles) => ({
        ...styles,
        backgroundColor: 'none',
        marginLeft: -155,
        marginTop: 3,
        width: 250,
        zIndex: 0,
      }),
      menuList: (style) => ({
        ...style,
        border: `1px solid ${theme.grey60}`,
        padding: 0,
        zIndex: -10,
      }),
      option: (styles, { isDisabled, isFocused }) => {
        return {
          ...styles,
          ':active': {
            ...styles[':active'],
            backgroundColor: theme.grey30,
          },
          backgroundColor: isFocused ? theme.grey40 : theme.grey20,
          color: isFocused ? theme.grey100 : theme.grey70,
          cursor: isDisabled ? 'not-allowed' : 'default',
          height: 36,
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
          components={{ DropdownIndicator, Option }}
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
