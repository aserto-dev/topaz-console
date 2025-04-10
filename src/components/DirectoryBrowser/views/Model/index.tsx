import 'allotment/dist/style.css'

import { Allotment } from 'allotment'
import React from 'react'
import styled from 'styled-components'

import { useManifestData } from '../../../../api/directory/parsers/manifest'
import { useDirectoryModelContext } from '../../../../services/DirectoryContextProvider'
import Delayed from '../../../common/Delayed'
import ModelEditor from './Editor'
import ModelGraph from './Graph'
import { useDirectoryReaderV3ObjectsListInfinite } from '../../../../api/v3/directory'

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

  const { data } = useDirectoryReaderV3ObjectsListInfinite(
    {
      object_type: 'user',
      'page.size': 1,
      'page.token': 'user:jerry@the-smiths.com',
    },
    {
      query: {
        getNextPageParam: (lastPage) => {
          return lastPage.page?.next_token
        },
      },
    },
  )

  console.log({ users: data })

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
          {visible ? <ModelEditor></ModelEditor> : null}
        </Allotment.Pane>
      </Allotment>
    </Container>
  )
}

export default Model
