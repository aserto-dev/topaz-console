import { HeaderGroup } from 'react-table'
import styled from 'styled-components'

import asc from '../../../assets/asc.svg'
import desc from '../../../assets/desc.svg'
import { useId } from 'react'

const Icon = styled.img`
  margin-left: 8px;
`

type TableHeaderProps<Data extends object> = {
  headerGroups: Array<HeaderGroup<Data>>
}

const TableHeader = <Data extends object>({
  headerGroups,
}: TableHeaderProps<Data>) => {
  const spanId = useId()
  const divId = useId()
  return (
    <thead>
      {headerGroups.map((headerGroup) => {
        const headerGroupProps = headerGroup.getHeaderGroupProps()
        return (
          <tr {...headerGroupProps} key={headerGroupProps.key}>
            {headerGroup.headers.map((column) => {
              const { key, ...headerProps } = column.getHeaderProps(
                column.getSortByToggleProps(),
              )
              return (
                <th {...headerProps} key={key} style={column.style?.headerCell}>
                  {column.render('Header', { key: key })}
                  <span key={spanId}>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <Icon src={desc} />
                      ) : (
                        <Icon src={asc} />
                      )
                    ) : (
                      ''
                    )}
                  </span>
                  <div key={divId}>
                    {column.canFilter ? column.render('Filter') : null}
                  </div>
                </th>
              )
            })}
          </tr>
        )
      })}
    </thead>
  )
}

export default TableHeader
