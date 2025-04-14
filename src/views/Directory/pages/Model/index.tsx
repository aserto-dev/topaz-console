import 'allotment/dist/style.css'

import { Allotment } from 'allotment'
import React from 'react'
import styled from 'styled-components'

import { useManifestData } from '../../../../api/directory/parsers/manifest'
import { useDirectoryModelContext } from '../../../../services/DirectoryContextProvider/hooks'
import Delayed from '../../../../components/common/Delayed'
import ModelEditor from './Editor'
import ModelGraph from './Graph'

const Container = styled.div`
  width: calc(100vw - 100px);
  height: calc(100vh - 140px);
  @media (max-width: 912px) {
    margin-top: 20px;
    width: 100vw;
    height: calc(100vh - 210px);
  }
`

const Model: React.FC = () => {
  const { visible } = useDirectoryModelContext()
  const { isLoading } = useManifestData()

  if (isLoading) {
    return null
  }

  return (
    <Container>
      <Allotment>
        <Allotment.Pane minSize={400}>
          <Delayed waitBeforeShow={50}>
            <ModelGraph></ModelGraph>
          </Delayed>
        </Allotment.Pane>
        <Allotment.Pane minSize={400} preferredSize="40%" visible={visible}>
          <Delayed waitBeforeShow={150}>
            {visible ? <ModelEditor></ModelEditor> : null}
          </Delayed>
        </Allotment.Pane>
      </Allotment>
    </Container>
  )
}

export default Model
