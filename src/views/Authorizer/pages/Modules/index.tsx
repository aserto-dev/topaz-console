import React, { useMemo, useState } from 'react'
import { Nav } from 'react-bootstrap'

import { usePoliciesList } from '../../../../api/v3/authorizer'
import Highlight from '../../../../components/common/Highlight'
import { Column, Content, ContentHeader, PillLineItem } from './styles'

const Modules: React.FC = () => {
  const [moduleId, setModuleId] = useState<string>('')

  const { data: listPolicyModules, isLoading } = usePoliciesList({
    field_mask: 'id,package_path,raw',
  })

  const policyModules = useMemo(() => {
    if (!listPolicyModules || !listPolicyModules.result) {
      return []
    }
    const result = listPolicyModules.result
      .map((module) => {
        return {
          id: module.id,
          package_path: module.package_path?.replace('data.', ''),
          raw: module.raw,
        }
      })
      .sort((a, b) => (a.package_path! < b.package_path! ? -1 : 1))

    setModuleId(result[0].id || '')
    return result
  }, [listPolicyModules])

  const fetchContent = (moduleId: string) => {
    return policyModules.find((module) => module.id === moduleId)?.raw || ''
  }

  const LeftSideItems = () => {
    if (policyModules.length === 0) {
      return null
    }

    return (
      <>
        {policyModules?.map((p) => (
          <PillLineItem key={p.id}>
            <Nav.Link className="light-pills" eventKey={p.id}>
              <span>{p.package_path}</span>
            </Nav.Link>
          </PillLineItem>
        ))}
      </>
    )
  }

  if (isLoading) {
    return null
  }

  return (
    <>
      <Column style={{ marginLeft: 20 }}>
        <ContentHeader>Module Name</ContentHeader>
        <Content $flex $paddingTop={18}>
          <Nav
            activeKey={moduleId!}
            className="flex-column"
            defaultActiveKey={moduleId!}
            variant="pills"
            onSelect={(key) => {
              setModuleId(key || '')
            }}
          >
            <LeftSideItems />
          </Nav>
        </Content>
      </Column>
      <Column>
        <>
          <ContentHeader>Definition</ContentHeader>
          <Content $flex $hasBorderLeft $paddingTop={18}>
            <Highlight language="rego">{fetchContent(moduleId!)}</Highlight>
          </Content>
        </>
      </Column>
    </>
  )
}

export default Modules
