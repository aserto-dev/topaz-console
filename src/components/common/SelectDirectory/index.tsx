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
  value: string | number
  label: string
  group: string
  shouldStopPropagation?: boolean
  onClick?: () => void
  hide?: boolean
}

type ReactSelectElement = SelectInstance<SelectOption>

export interface SelectProps
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

const formatGroupLabel = (group: GroupBase<SelectOption>) => (
  <div>{group.label}</div>
)

const SelectDirectory: React.ForwardRefExoticComponent<
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
    const { pathname } = useLocation()
    const defaultSelectedGroup = pathname.substring(
      pathname.lastIndexOf('/') + 1,
    )
    const [selectedGroup, setSelectedGroup] = useState(defaultSelectedGroup)
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const removeFocusBox = {
      outline: 'none',
      webkitBoxShadow: 'none',
      boxShadow: 'none',
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
          marginLeft: 24,
          overflowY: 'hidden',
          minHeight: 36,
          backgroundColor: isDisabled ? theme.grey40 : theme.primaryBlack,
          color: isDisabled ? theme.grey40 : theme.grey100,
          borderColor: isFocused ? theme.indogoAccent2 : theme.grey40,
          opacity: isDisabled ? 0.6 : 1,
          outline: isFocused ? 'none' : '',
          boxShadow: 'none',
          ':hover': {
            ...styles[':hover'],
            backgroundColor: theme.grey10,
            borderColor: theme.indogoAccent1,
            color: theme.grey100,
          },
        }
      },
      option: (styles, { isDisabled, isSelected }) => {
        return {
          ...styles,
          backgroundColor: isDisabled
            ? theme.grey20
            : isSelected
              ? theme.grey20
              : theme.grey20,
          ':hover': {
            backgroundColor: theme.grey40,
            color: theme.grey100,
          },
          height: '100%',
          minHeight: 30,
          fontSize: 14,
          paddingLeft: isSelected ? '16px' : '38px',
          cursor: isDisabled ? 'not-allowed' : 'default',
          ':active': {
            ...styles[':active'],
            backgroundColor: theme.grey40,
          },
        }
      },
      groupHeading: (styles) => {
        return {
          ...styles,
          paddingLeft: 6,
          margin: 0,
          minHeight: 40,
          fontSize: 14,
          height: '100%',
          color: theme.grey100,
          backgroundColor: theme.grey20,
          ':hover': {
            backgroundColor: theme.grey40,
          },
        }
      },
      group: (styles) => {
        return {
          ...styles,
          padding: 0,
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
      menu: (styles) => ({
        ...styles,
        marginLeft: 23,
        zIndex: 2,
        width: '96%',
        marginTop: 1,
        backgroundColor: theme.grey20,
        boxShadow: '0px 2px 6px 4px rgba(0,0,0,0.3)',
      }),
      menuList: (style) => ({
        ...style,
        zIndex: 5,
        padding: 0,
        border: `1px solid ${theme.grey40}`,
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '2px',
        minHeight: 284,
      }),
      dropdownIndicator: (styles, { isDisabled }) => ({
        ...styles,
        color: isDisabled ? theme.grey40 : theme.grey70,
        padding: 7,
      }),

      indicatorSeparator: (styles, { isDisabled }) => ({
        ...styles,
        backgroundColor: isDisabled ? theme.grey30 : theme.grey30,
      }),
      valueContainer: (styles) => ({
        ...styles,
        fontSize: 14,
      }),
      noOptionsMessage: (styles) => ({
        ...styles,
        backgroundColor: theme.grey20,
      }),
      loadingMessage: (styles) => ({
        ...styles,
        backgroundColor: theme.grey20,
        minHeight: 36,
      }),
      singleValue: (styles, { isDisabled }) => ({
        ...styles,
        color: isDisabled ? theme.grey40 : theme.grey100,
        ...removeFocusBox,
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
          components={{ Option, GroupHeading }}
          styles={
            modifyCustomStyle ? modifyCustomStyle(colourStyles) : colourStyles
          }
        />
      </div>
    )
  },
)
export default SelectDirectory
