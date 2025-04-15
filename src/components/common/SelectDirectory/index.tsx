import React, { useCallback, useState } from 'react'
import { useLocation } from 'react-router'
import ReactSelect, {
  components,
  GroupBase,
  GroupHeadingProps,
  OptionProps,
  Props,
  SelectInstance,
  StylesConfig,
} from 'react-select'
import styled from 'styled-components'

import { theme } from '../../../theme'
import transparent_circle from '../../common/NestedVerticalTabs/assets/selected_blank.svg'
import circle from '../../common/NestedVerticalTabs/assets/selected_circle.svg'
import Label from '../Label'
import { UndecoratedLink } from '../UndecoratedLink'

const ImageContainer = styled.div`
display: flex:
flex-direction: column;
height: 40px;
img{
padding-right: 5px;
margin-left: 5px;
}
`
const CircleContainer = styled.div`
  display: flex;
  gap: 8px;
`
export type SelectOption = {
  group: string
  hide?: boolean
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

const formatGroupLabel = (group: GroupBase<SelectOption>) => (
  <div>{group.label}</div>
)

const SelectDirectory: React.ForwardRefExoticComponent<
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
    const { pathname } = useLocation()
    const defaultSelectedGroup = pathname.substring(
      pathname.lastIndexOf('/') + 1,
    )
    const [selectedGroup, setSelectedGroup] = useState(defaultSelectedGroup)
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const removeFocusBox = {
      boxShadow: 'none',
      outline: 'none',
      webkitBoxShadow: 'none',
    }
    const Option = useCallback((props: OptionProps<SelectOption, false>) => {
      return (
        <ImageContainer style={{ display: !props.data.label ? 'none' : '' }}>
          <components.Option
            {...props}
            innerProps={{
              ...props.innerProps,
              onMouseDown: (e) => {
                setSelectedGroup('')
                if (props.data.shouldStopPropagation) {
                  e.stopPropagation()
                  props.data?.onClick?.()
                }
              },
            }}
          >
            {props.isSelected && <img alt="plus" src={circle} />}{' '}
            {props.children}
          </components.Option>
        </ImageContainer>
      )
    }, [])
    const GroupHeading = (
      props: GroupHeadingProps<SelectOption, false, GroupBase<SelectOption>>,
    ) => {
      return (
        <UndecoratedLink
          to={String(props.data.options[0].value)}
          onClick={() => {
            setMenuIsOpen(false)
            setSelectedGroup(
              props.data.options.length <= 1 ? props.data.label || '' : '',
            )
          }}
        >
          <components.GroupHeading {...props}>
            <CircleContainer>
              {props.data.label?.toUpperCase() ===
              selectedGroup.toUpperCase() ? (
                <img alt="circle" src={circle} />
              ) : (
                <img alt="transparent_circle" src={transparent_circle} />
              )}
              {props.children}
            </CircleContainer>
          </components.GroupHeading>
        </UndecoratedLink>
      )
    }

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
          backgroundColor: isDisabled ? theme.grey40 : theme.primaryBlack,
          borderColor: isFocused ? theme.indogoAccent2 : theme.grey40,
          boxShadow: 'none',
          color: isDisabled ? theme.grey40 : theme.grey100,
          marginLeft: 24,
          minHeight: 36,
          opacity: isDisabled ? 0.6 : 1,
          outline: isFocused ? 'none' : '',
          overflowY: 'hidden',
        }
      },
      dropdownIndicator: (styles, { isDisabled }) => ({
        ...styles,
        color: isDisabled ? theme.grey40 : theme.grey70,
        padding: 7,
      }),
      group: (styles) => {
        return {
          ...styles,
          padding: 0,
        }
      },
      groupHeading: (styles) => {
        return {
          ...styles,
          ':hover': {
            backgroundColor: theme.grey40,
          },
          backgroundColor: theme.grey20,
          color: theme.grey100,
          fontSize: 14,
          height: '100%',
          margin: 0,
          minHeight: 40,
          paddingLeft: 6,
        }
      },
      indicatorSeparator: (styles, { isDisabled }) => ({
        ...styles,
        backgroundColor: isDisabled ? theme.grey30 : theme.grey30,
      }),
      input: (styles) => {
        return {
          ...styles,
          borderColor: theme.grey60,
          color: theme.grey100,
        }
      },
      loadingMessage: (styles) => ({
        ...styles,
        backgroundColor: theme.grey20,
        minHeight: 36,
      }),
      menu: (styles) => ({
        ...styles,
        backgroundColor: theme.grey20,
        boxShadow: '0px 2px 6px 4px rgba(0,0,0,0.3)',
        marginLeft: 23,
        marginTop: 1,
        width: '96%',
        zIndex: 2,
      }),
      menuList: (style) => ({
        ...style,
        border: `1px solid ${theme.grey40}`,
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '2px',
        minHeight: 284,
        padding: 0,
        zIndex: 5,
      }),

      noOptionsMessage: (styles) => ({
        ...styles,
        backgroundColor: theme.grey20,
      }),
      option: (styles, { isDisabled, isSelected }) => {
        return {
          ...styles,
          ':active': {
            ...styles[':active'],
            backgroundColor: theme.grey40,
          },
          ':hover': {
            backgroundColor: theme.grey40,
            color: theme.grey100,
          },
          backgroundColor: isDisabled
            ? theme.grey20
            : isSelected
              ? theme.grey20
              : theme.grey20,
          cursor: isDisabled ? 'not-allowed' : 'default',
          fontSize: 14,
          height: '100%',
          minHeight: 30,
          paddingLeft: isSelected ? '16px' : '38px',
        }
      },
      placeholder: (styles, { isDisabled }) => ({
        ...styles,
        color: isDisabled ? theme.grey40 : theme.grey90,
      }),
      singleValue: (styles, { isDisabled }) => ({
        ...styles,
        color: isDisabled ? theme.grey40 : theme.grey100,
        ...removeFocusBox,
      }),
      valueContainer: (styles) => ({
        ...styles,
        fontSize: 14,
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
          ref={ref}
          formatGroupLabel={formatGroupLabel}
          inputId={name}
          isDisabled={disabled}
          isSearchable={false}
          menuIsOpen={menuIsOpen}
          name={name}
          value={value}
          onChange={onChange}
          onMenuClose={() => setMenuIsOpen(false)}
          onMenuOpen={() => setMenuIsOpen(true)}
          {...props}
          components={{ GroupHeading, Option }}
          styles={
            modifyCustomStyle ? modifyCustomStyle(colourStyles) : colourStyles
          }
        />
      </div>
    )
  },
)
export default SelectDirectory
