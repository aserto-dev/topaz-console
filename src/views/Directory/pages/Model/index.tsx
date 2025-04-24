import 'allotment/dist/style.css'
import { Allotment } from 'allotment'
import React, { Suspense } from 'react'
import styled from 'styled-components'

import { useManifestData } from '../../../../api/directory/parsers/manifest'
import Delayed from '../../../../components/common/Delayed'
import { useDirectoryModelContext } from '../../../../services/DirectoryContextProvider/hooks'
const ModelEditor = React.lazy(() => import('./Editor'))
const ModelGraph = React.lazy(() => import('./Graph'))

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
            <Suspense fallback={<></>}>
              <ModelGraph></ModelGraph>
            </Suspense>
          </Delayed>
        </Allotment.Pane>
        <Allotment.Pane minSize={400} preferredSize="40%" visible={visible}>
          {visible ? (
            <Suspense fallback={<></>}>
              <ModelEditor></ModelEditor>
            </Suspense>
          ) : null}
        </Allotment.Pane>
      </Allotment>
    </Container>
  )
}

export default Model
