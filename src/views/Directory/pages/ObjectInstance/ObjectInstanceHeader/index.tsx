import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { Query, useQueryClient } from '@tanstack/react-query'

import { useDirectoryV3ObjectTypesList } from '../../../../../api/directory/customQuery'
import {
  getDirectoryReaderV3ObjectGetQueryKey,
  useDirectoryWriterV3ObjectDelete,
} from '../../../../../api/v3/directory'
import {
  getDirectoryReaderV3ObjectsListQueryKey,
  getDirectoryReaderV3RelationsListQueryKey,
} from '../../../../../api/v3/directory'
import BinImg from '../../../../../assets/bin.svg'
import EditImg from '../../../../../assets/edit_pen.svg'
import line from '../../../../../assets/line.svg'
import Breadcrumb from '../../../../../components/common/Breadcrumb'
import { useShowError } from '../../../../../services/ErrorModalProvider'
import { V3Object } from '../../../../../types/directory'
import {
  HeaderButtonContainer,
  ImageButton,
  ObjectHeaderContainer,
} from '../../../styles'
import DataChangedModal from '../../Directory/DataChangedModal'
import DirectoryDeleteModal from '../../Directory/DirectoryDeleteModal'
import EditObjectModal from '../EditObjectModal'

const ObjectInstanceHeader: React.FC<{ object?: V3Object }> = ({ object }) => {
  const showError = useShowError()
  const navigate = useNavigate()
  const { id: objectId, type: objectType } = object || {}
  const safeObjectType = objectType || ''
  const safeObjectId = objectId || ''

  const { data: objectTypeData } = useDirectoryV3ObjectTypesList({
    name: objectType,
  })
  const objectTypes = useMemo(() => {
    return objectTypeData?.results || []
  }, [objectTypeData?.results])

  const [showEditModal, setShowEditModal] = useState(false)
  const [showDataChangedModal, setShowDataChangedModal] = useState(false)
  const queryClient = useQueryClient()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const objectsListInfiniteQueryKey = getDirectoryReaderV3ObjectsListQueryKey({
    object_type: safeObjectType,
  })
  const relationsListInfiniteQueryKey =
    getDirectoryReaderV3RelationsListQueryKey()
  const objectGetQueryKey = getDirectoryReaderV3ObjectGetQueryKey(
    safeObjectType,
    safeObjectId,
  )

  const { mutateAsync: deleteObjectMutation } =
    useDirectoryWriterV3ObjectDelete({
      mutation: {
        onError: (error) => showError(error),
        onSuccess: () => {
          navigate(`/ui/directory/objects/${safeObjectType}`, {
            replace: true,
          })
          queryClient.removeQueries({ queryKey: objectGetQueryKey })
          // remove cache for current object type and all the relations
          queryClient.removeQueries({
            predicate: (query: Query) => {
              return (
                query.queryKey.includes(
                  objectsListInfiniteQueryKey[0] as string,
                ) ||
                query.queryKey.includes(
                  relationsListInfiniteQueryKey[0] as string,
                )
              )
            },
          })
        },
      },
    })

  return (
    <ObjectHeaderContainer>
      <EditObjectModal
        objectInstance={object!}
        show={showEditModal}
        showDataChangedModal={() => setShowDataChangedModal(true)}
        onHide={() => setShowEditModal(false)}
        onSuccess={(v) => {
          setShowEditModal(false)
          navigate(
            `/ui/directory/objects/${safeObjectType}/${encodeURIComponent(v.id)}`,
            {
              replace: true,
            },
          )
        }}
      />
      <DirectoryDeleteModal
        deleteData={{ name: safeObjectType, type: 'Object Instance' }}
        show={showDeleteModal}
        specificText={`Delete the object instance "${objectId}" from the directory. `}
        onClickRemove={() => {
          deleteObjectMutation({
            objectId: safeObjectId,
            objectType: safeObjectType,
            params: { with_relations: true },
          })
        }}
        onHide={() => setShowDeleteModal(false)}
      />
      <DataChangedModal
        changedDataType="Object"
        show={showDataChangedModal}
        onHide={() => setShowDataChangedModal(false)}
      />
      <Breadcrumb
        breadcrumbParts={[
          {
            text:
              objectTypes[0]?.displayName || object?.type || objectType || '',
            url: `/ui/directory/objects/${safeObjectType}`,
          },
          {
            text: object?.display_name || safeObjectId,
          },
        ]}
        variant="small"
      />
      <HeaderButtonContainer>
        <ImageButton onClick={() => setShowEditModal(true)}>
          <img alt="" src={EditImg} />
          Edit
        </ImageButton>
        <img alt="separator" height={27} src={line} />
        <ImageButton onClick={() => setShowDeleteModal(true)}>
          <img alt="delete" src={BinImg} />
          Delete
        </ImageButton>
      </HeaderButtonContainer>
    </ObjectHeaderContainer>
  )
}

export default ObjectInstanceHeader
