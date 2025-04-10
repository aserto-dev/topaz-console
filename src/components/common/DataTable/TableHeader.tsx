import { HeaderGroup } from 'react-table'
import styled from 'styled-components'

import asc from '../../../assets/asc.svg'
import desc from '../../../assets/desc.svg'

const Icon = styled.img`
  margin-left: 8px;
`

type TableHeaderProps<Data extends object> = {
  headerGroups: Array<HeaderGroup<Data>>
}

const TableHeader = <Data extends object>({
  headerGroups,
}: TableHeaderProps<Data>) => (
  <thead>
    {headerGroups.map((headerGroup) => {
      const headerGroupProps = headerGroup.getHeaderGroupProps()
      return (
        <tr {...headerGroupProps} key={headerGroupProps.key}>
          {headerGroup.headers.map((column) => {
            const headerProps = column.getHeaderProps(
              column.getSortByToggleProps(),
            )
            return (
              <th
                {...headerProps}
                key={headerProps.key}
                style={column.style?.headerCell}
              >
                {column.render('Header')}
                <span>
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
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </th>
            )
          })}
        </tr>
      )
    })}
  </thead>
)

export default TableHeader
