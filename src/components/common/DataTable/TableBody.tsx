import React from 'react'
import {
  Cell,
  ColumnInstance,
  Row,
  TablePropGetter,
  TableProps,
  TableRowProps,
} from 'react-table'
import styled, { css } from 'styled-components'

import { theme } from '../../../theme'

const Tbody = styled.tbody`
  transition:
    visibility 700ms ease,
    opacity 500ms ease;
`

export type SubComponent<Data extends object> = React.FunctionComponent<{
  row: Row<Data>
}>

export const RowComponent = styled.tr<{ isExpanded?: boolean }>`
  ${({ isExpanded }) => {
    if (isExpanded) {
      return css`
        background-color: ${theme.grey30};
        color: ${theme.grey100} !important;
        cursor: pointer;
      `
    }
  }}
`

type TableBodyProps<Data extends object> = {
  getCellProps?: (cell: Cell<Data>) => void
  getTableBodyProps: (
    propGetter?: TablePropGetter<Data> | undefined,
  ) => TableProps
  prepareRow: (row: Row<Data>) => void
  renderRowSubComponent?: SubComponent<Data>
  rowComponent?: React.ComponentType<
    TableRowProps & { $row: Row<Data>; isExpanded: boolean; }
  >
  rows: Row<Data>[]
  visibleColumns: Array<ColumnInstance<Data>>
}

const TableBody = <Data extends object>({
  getCellProps,
  getTableBodyProps,
  prepareRow,
  renderRowSubComponent,
  rowComponent,
  rows,
  visibleColumns,
}: TableBodyProps<Data>) => (
  <Tbody {...getTableBodyProps()}>
    {rows.map((row) => {
      prepareRow(row)
      const shouldShowSubRow = !!renderRowSubComponent && row.isExpanded
      const Tr = rowComponent || RowComponent
      const { key, ...rowProps } = row.getRowProps()
      return (
        <React.Fragment key={key}>
          <Tr key={key} $row={row} isExpanded={row.isExpanded} {...rowProps}>
            {row.cells.map((cell) => {
              const customCellProps = getCellProps ? getCellProps(cell) : {}
              const cellProps = cell.getCellProps()
              return (
                <td
                  {...cellProps}
                  {...customCellProps}
                  key={cellProps.key}
                  width={
                    cell.column?.style?.cellWidth
                      ? cell.column.style.cellWidth
                      : ''
                  }
                >
                  {cell.render('Cell')}
                </td>
              )
            })}
          </Tr>
          <tr
            style={{
              backgroundColor: theme.grey10,
            }}
          >
            <td
              colSpan={visibleColumns.length}
              style={{
                backgroundColor: theme.grey10,
                maxHeight: 300,
                opacity: 1,
                padding: 20,
                transition:
                  'max-height 900ms ease, opacity 900ms, padding-top 200ms',
                ...(!shouldShowSubRow && {
                  height: 0,
                  maxHeight: 0,
                  opacity: 0,
                  overflow: 'hidden',
                  padding: 0,
                }),
              }}
            >
              <div
                style={{
                  transition: 'all 10ms',
                  ...(!shouldShowSubRow && {
                    height: 0,
                    visibility: 'hidden',
                  }),
                }}
              >
                {shouldShowSubRow && (
                  <React.Suspense fallback={null}>
                    {shouldShowSubRow && (
                      <React.Suspense fallback={null}>
                        {Promise.resolve(renderRowSubComponent({ row })).then(
                          (resolved) => resolved,
                        )}
                      </React.Suspense>
                    )}
                  </React.Suspense>
                )}
              </div>
            </td>
          </tr>
        </React.Fragment>
      )
    })}
  </Tbody>
)

export default TableBody
