import { GroupBase, StylesConfig } from 'react-select'

import { theme } from '../../../theme'
import { SelectOption } from '.'
export const formatGroupLabel = (group: GroupBase<SelectOption>) => (
  <div>{group.label}</div>
)
const removeFocusBox = {
  outline: 'none',
  webkitBoxShadow: 'none',
  boxShadow: 'none',
}
export const colourStyles: StylesConfig<SelectOption, false> = {
  control: (styles, { isDisabled, isFocused }) => {
    return {
      ...styles,
      minHeight: 36,
      height: '100%',
      backgroundColor: isDisabled ? theme.grey20 : theme.primaryBlack,
      color: isDisabled ? theme.grey40 : theme.grey100,
      borderColor: isFocused ? theme.indogoAccent2 : theme.grey40,
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
          ? theme.grey40
          : isSelected
            ? theme.grey20
            : theme.grey20,
      borderLeft: isSelected
        ? `5px solid ${theme.indogoAccent3}`
        : `5px solid transparent`,
      color: isFocused ? theme.grey100 : theme.grey70,
      height: '100%',
      minHeight: 36,
      fontSize: 14,
      lineHeight: '20px',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: theme.grey40,
      },
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    }
  },
  groupHeading: (styles, props) => {
    if (!props.data.label) {
      return {
        ...styles,
        height: 1,
        backgroundColor: theme.grey,
        margin: 0,
      }
    } else {
      return {
        ...styles,
        display: 'flex',
        alignItems: 'center',
        margin: 0,
        minHeight: 36,
        height: '100%',
        backgroundColor: theme.grey20,
        color: theme.grey100,
        fontSize: 14,
        paddingLeft: 6,
        fontWeight: 'bold',
      }
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
  singleValue: (styles, { isDisabled }) => ({
    ...styles,
    color: isDisabled ? theme.grey40 : theme.grey100,
    ...removeFocusBox,
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: theme.grey40,
    zIndex: 6,
    marginTop: 0,
    boxShadow: '0px 2px 6px 4px rgba(0,0,0,0.3)',
  }),
  dropdownIndicator: (styles, { isDisabled }) => ({
    ...styles,
    color: isDisabled ? theme.grey40 : theme.grey70,
    padding: 7,
  }),
  menuList: (style) => ({
    ...style,
    zIndex: 5,
    padding: 0,
    border: `1px solid ${theme.grey40}`,
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
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
}
