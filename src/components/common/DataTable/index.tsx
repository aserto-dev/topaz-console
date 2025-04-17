import React from 'react'
import styled, { css } from 'styled-components'

import { flexRender, Row, Table } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import { theme } from '../../../theme'

type DataTableProps<Data extends object> = {
  fetchMoreOnBottomReached?: (
    containerRefElement?: HTMLDivElement | null,
  ) => void
  isFetching?: boolean
  table: Table<Data>
}

export const RowComponent = styled.tr<{ isExpanded?: boolean }>`
  ${({ isExpanded }) => {
    if (isExpanded) {
      return css`
        background-color: ${theme.grey30};
        color: ${theme.grey100} !important;
        cursor: pointer;
        box-shadow: inset 4px 0px 0px -1px ${theme.indogoAccent4} !important;
      `
    }
  }}
`

const DataTable = <Data extends object>({
  fetchMoreOnBottomReached,
  isFetching = false,
  table,
}: DataTableProps<Data>) => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  return (
    <div className="tableWrapper">
      <div
        ref={tableContainerRef}
        className="container"
        style={{
          height: '420px', //should be a fixed height
          maxWidth: '100%',
          overflow: 'auto', //our scrollable table container
          position: 'relative', //needed for sticky header
        }}
        onScroll={(e) => fetchMoreOnBottomReached?.(e.currentTarget)}
      >
        <table style={{ display: 'grid' }}>
          <thead
            style={{
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ display: 'flex', width: '100%' }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        display: 'flex',
                        width: header.getSize(),
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody
            style={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: 'relative', //needed for absolute positioning of rows
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<Data>
              return (
                <RowComponent
                  key={row.id}
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  isExpanded={row.getIsSelected()}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    width: '100%',
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          display: 'flex',
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    )
                  })}
                </RowComponent>
              )
            })}
          </tbody>
        </table>
      </div>
      {isFetching && <div>...</div>}
    </div>
  )
}

export default DataTable
