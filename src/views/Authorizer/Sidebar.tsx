import { useLocation, useNavigate } from 'react-router'

import React from 'react'
import { LeftContainer } from '../Directory/pages/Directory/styles'
import { Row, SelectContainer } from './styles'
import Select, { SelectOption } from '../../components/common/Select'
import { VerticalTab } from '../../components/common/VerticalTab'

enum OptionValues {
  docs = 'API Browser',
  evaluator = 'Evaluator',
  modules = 'Modules',
}

const AuthorizerSidebar: React.FC = () => {
  const navigate = useNavigate()

  interface VerticalTabOptionsProps {
    label: string
    value: keyof typeof OptionValues
    isDisabled?: boolean
  }

  const verticalTabOptions: VerticalTabOptionsProps[] = [
    { label: OptionValues.modules, value: 'modules' },
    { label: OptionValues.evaluator, value: 'evaluator' },
    { label: OptionValues.docs, value: 'docs' },
  ]
  const { pathname } = useLocation()
  const selectedOption = pathname.replace(`/ui/authorizer/`, '').split('/')[0]
  const onChangeVerticalTab = (value: string) => {
    navigate(`/ui/authorizer/${value as keyof typeof OptionValues}`)
  }

  return (
    <Row>
      <LeftContainer>
        <VerticalTab
          options={verticalTabOptions}
          selectedValue={selectedOption}
          onChange={onChangeVerticalTab}
        />
      </LeftContainer>
      <SelectContainer>
        <Select
          aria-label="Sections"
          options={verticalTabOptions}
          value={verticalTabOptions.find(
            (option: SelectOption) => option.value === selectedOption,
          )}
          onChange={(option) => onChangeVerticalTab(String(option!.value))}
        />
      </SelectContainer>
    </Row>
  )
}

export default AuthorizerSidebar
