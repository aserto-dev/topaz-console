import { GroupBase, StylesConfig } from 'react-select'

import { SelectOption } from '.'
import { theme } from '../../../theme'
export const formatGroupLabel = (group: GroupBase<SelectOption>) => (
  <div>{group.label}</div>
)
const removeFocusBox = {
  boxShadow: 'none',
  outline: 'none',
  webkitBoxShadow: 'none',
}
export const colourStyles: StylesConfig<SelectOption, false> = {
  control: (styles, { isDisabled, isFocused }) => {
    return {
      ...styles,
      ':hover': {
        ...styles[':hover'],
        backgroundColor: theme.grey10,
        borderColor: theme.indogoAccent1,
        color: theme.grey100,
      },
      backgroundColor: isDisabled ? theme.grey20 : theme.primaryBlack,
      borderColor: isFocused ? theme.indogoAccent2 : theme.grey40,
      borderWidth: 1,
      boxShadow: 'none',
      color: isDisabled ? theme.grey40 : theme.grey100,
      height: '100%',
      minHeight: 36,
      opacity: isDisabled ? 0.6 : 1,
      outline: isFocused ? 'none' : '',
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
  groupHeading: (styles, props) => {
    if (!props.data.label) {
      return {
        ...styles,
        backgroundColor: theme.grey,
        height: 1,
        margin: 0,
      }
    } else {
      return {
        ...styles,
        alignItems: 'center',
        backgroundColor: theme.grey20,
        color: theme.grey100,
        display: 'flex',
        fontSize: 14,
        fontWeight: 'bold',
        height: '100%',
        margin: 0,
        minHeight: 36,
        paddingLeft: 6,
      }
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
    backgroundColor: theme.grey40,
    boxShadow: '0px 2px 6px 4px rgba(0,0,0,0.3)',
    marginTop: 0,
    zIndex: 6,
  }),
  menuList: (style) => ({
    ...style,
    border: `1px solid ${theme.grey40}`,
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    padding: 0,
    zIndex: 5,
  }),
  noOptionsMessage: (styles) => ({
    ...styles,
    backgroundColor: theme.grey20,
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      ':active': {
        ...styles[':active'],
        backgroundColor: theme.grey40,
      },
      backgroundColor: isDisabled
        ? theme.grey20
        : isFocused
          ? theme.grey40
          : isSelected
            ? theme.grey20
            : theme.grey20,
      borderLeft: isSelected
        ? `5px solid ${theme.indogoAccent3}`
        : `5px solid transparent`,
      color: isFocused ? theme.grey100 : theme.grey70,
      cursor: isDisabled ? 'not-allowed' : 'default',
      fontSize: 14,
      height: '100%',
      lineHeight: '20px',
      minHeight: 36,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
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
