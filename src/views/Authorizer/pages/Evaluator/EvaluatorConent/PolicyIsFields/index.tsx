import React, { useEffect, useMemo } from 'react'

import Label from '../../../../../../components/common/Label'
import { Row } from '../../../../../../components/common/Row'
import Select from '../../../../../../components/common/Select'
import { useIsPolicyEvaluatorContext } from '../../../../../../services/PolicyEvaluatorContextProvider/hooks'
import { ApiModule } from '../../../../../../types/authorizer'
import { Decisions } from '../PolicyCommonFields/Decisions'
import { ResourceContext } from '../PolicyCommonFields/ResourceContext'
import { FieldContainer, SectionTitleContainer } from '../styles'
import { SubField } from '../Subfield'

type PolicyIsFieldsProps = {
  policyModules: Array<ApiModule>
}

export const PolicyIsFields: React.FC<PolicyIsFieldsProps> = ({
  policyModules,
}) => {
  const { pathSelect, setPathSelect } = useIsPolicyEvaluatorContext()

  const policyModulesOptions = useMemo(() => {
    return policyModules.map((module) => {
      return { label: module.package_path!, value: module.package_path! }
    })
  }, [policyModules])

  useEffect(() => {
    if (
      !pathSelect &&
      !!policyModulesOptions &&
      policyModulesOptions.length > 0
    ) {
      setPathSelect(String(policyModulesOptions[0].value))
    }
  }, [pathSelect, policyModulesOptions, setPathSelect])

  return (
    <div>
      <SectionTitleContainer>
        <Label>Policy Context</Label>
      </SectionTitleContainer>
      <SubField>
        <Row $centered $marginLeft={20}>
          <FieldContainer>
            <Select
              label="Path"
              name="path-select"
              options={policyModulesOptions}
              value={policyModulesOptions.find(
                (option) => option.value === pathSelect,
              )}
              onChange={(option) => {
                if (option?.value) {
                  setPathSelect(String(option.value))
                }
              }}
            />
          </FieldContainer>
        </Row>
      </SubField>
      <Decisions />
      <ResourceContext />
    </div>
  )
}
