import React from 'react'
import styled, { css } from 'styled-components'

import { flexRender, Table } from '@tanstack/react-table'

import { theme } from '../../../theme'

export type DataTableProps<Data extends object> = {
  table: Table<Data>
}

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

const DataTable = <Data extends object>({ table }: DataTableProps<Data>) => {
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                align={
                  (
                    cell.column.columnDef.meta as {
                      align:
                        | 'center'
                        | 'char'
                        | 'justify'
                        | 'left'
                        | 'right'
                        | undefined
                    }
                  )?.align
                }
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  )
}

export default DataTable
