import React, { useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router'

import userAvatar from '../../../../../assets/generic-user-avatar.svg'
import NoUsersImage from '../../../../../assets/users.svg'
import EmptyTablePlaceholder from '../../../../../components/common/EmptyTablePlaceholder'
import { V3Object, V3ObjectProperties } from '../../../../../types/directory'
import { UndecoratedLink } from '../../../../../components/common/UndecoratedLink'
import ObjectsHeader from '../ObjectsHeader'
import { useIsScrollable } from '../useIsScrollable'
import {
  BoldSpan,
  Container,
  EllipsisDiv,
  FindButton,
  PageHeaderInputFind,
  SubjectCard,
  UsersContainer,
} from './styles'
import {
  getNextPage,
  useDirectoryV3ObjectTypesList,
} from '../../../../../api/directory/customQuery'
import {
  useDirectoryReaderV3ObjectGet,
  useDirectoryReaderV3ObjectsListInfinite,
} from '../../../../../api/v3/directory'

const UserObjects: React.FC = () => {
  const { objectType } = useParams()
  const safeObjectType = objectType || ''

  const [users, setUsers] = useState<V3Object[]>([])
  const [findFilter, setFindFilter] = useState<string>('')
  const { data } = useDirectoryV3ObjectTypesList()
  const objectTypes = useMemo(() => {
    return (data?.results || []).map((o) => o.name)
  }, [data?.results])

  const {
    data: usersData,
    isFetching: isFetchingUsers,
    hasNextPage: hasMoreUsers,
    fetchNextPage: fetchNextUsersData,
  } = useDirectoryReaderV3ObjectsListInfinite(
    {
      object_type: safeObjectType,
      'page.size': 100,
    },
    {
      query: {
        getNextPageParam: getNextPage,
        enabled: objectTypes.includes(safeObjectType),
      },
    },
  )

  const listUsers = useMemo(() => {
    const users =
      usersData?.pages.map((page) => page.results || []).flat() ?? []
    setUsers(users)
    return users
  }, [usersData?.pages, setUsers])

  const { refetch: refetchUser } = useDirectoryReaderV3ObjectGet(
    safeObjectType,
    findFilter,
    {},
    {
      query: {
        enabled: false,
        retry: false,
        meta: {
          showError: false,
        },
      },
    },
  )
  const fetchData = useIsScrollable({
    isFetching: isFetchingUsers,
    hasMoreData: hasMoreUsers || false,
    fetchNextData: fetchNextUsersData,
  })
  useCallback(() => {
    fetchData()
  }, [fetchData])

  return (
    <Container>
      <ObjectsHeader>
        <>
          <PageHeaderInputFind
            placeholder="User ID"
            value={findFilter}
            onChange={(e: { target: { value: string } }) => {
              if (e.target.value === '' || e.target.value === undefined) {
                setUsers(listUsers)
              }
              setFindFilter(e.target.value)
            }}
          />
          <FindButton
            disabled={!findFilter}
            onClick={async () => {
              const result = (await refetchUser()).data?.result
              setUsers(result ? [result] : [])
            }}
          >
            &nbsp;Find&nbsp;
          </FindButton>
        </>
      </ObjectsHeader>

      <UsersContainer>
        {users.length ? (
          <InfiniteScroll
            dataLength={users.length}
            hasMore={!!hasMoreUsers}
            loader={isFetchingUsers}
            next={fetchNextUsersData}
          >
            {users.map((u) => {
              const userProps = u.properties as V3ObjectProperties & {
                picture: string
                email: string
              }

              return (
                <UndecoratedLink
                  key={u.id}
                  to={`/ui/directory/objects/${safeObjectType}/${encodeURIComponent(u.id)}`}
                >
                  <SubjectCard $inline={true}>
                    <img
                      alt={u.display_name ?? u.id}
                      src={userProps.picture}
                      onError={(
                        event: React.SyntheticEvent<HTMLImageElement, Event>,
                      ) => {
                        event.currentTarget.src = userAvatar
                      }}
                    />
                    <div>
                      <BoldSpan>{u.display_name}</BoldSpan>
                      <span>{userProps.email}</span>
                      <EllipsisDiv>
                        <BoldSpan>ID: </BoldSpan>
                        <span>{u.id}</span>
                      </EllipsisDiv>
                    </div>
                  </SubjectCard>
                </UndecoratedLink>
              )
            })}
          </InfiniteScroll>
        ) : (
          <EmptyTablePlaceholder
            body={`To add one, click the "Add" button in the top left.`}
            imgAlt="Empty Directory"
            imgSrc={NoUsersImage}
            header={''}
          />
        )}
      </UsersContainer>
    </Container>
  )
}

export default UserObjects
