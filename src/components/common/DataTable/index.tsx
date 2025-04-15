import React, { useEffect, useImperativeHandle, useState } from 'react'
import {
  Cell,
  Column,
  Row,
  TableInstance,
  TableRowProps,
  TableState,
  useExpanded,
  useFilters,
  useSortBy,
  useTable,
} from 'react-table'
import styled, { css } from 'styled-components'

import { theme } from '../../../theme'
import DataLoader, { PagingConfig } from './DataLoader'
import TableBody, { SubComponent } from './TableBody'
import TableHeader from './TableHeader'

type DataTablePagingProps<Data extends object> = Omit<
  PagingConfig,
  'loader'
> & {
  loadingContent: Data[]
}

type DataTableProps<Data extends object> = {
  columns: readonly Column<Data>[]
  data: readonly Data[]
  hideHeaders?: boolean
  getCellProps?: (cell: Cell<Data>) => void
  paging?: DataTablePagingProps<Data>
  renderRowSubComponent?: SubComponent<Data>
  rowComponent?: React.ComponentType<
    TableRowProps & { isExpanded: boolean; $row: Row<Data> }
  >
  initialState?: Partial<TableState<Data>>
  mRef?: React.RefObject<TableInstance<Data> | null>
  sticky?: boolean
}

const TableContainer = styled.div<{
  $sticky?: boolean
  $topDistance?: number
}>`
  .tableWrap {
    border-bottom: 1px solid black;
  }
  ${({ $sticky }) =>
    $sticky &&
    css<{ $topDistance?: number }>`
      .scrollTarget {
        ${({ $topDistance }) => `height: calc(100vh - ${$topDistance || 0}px)`};
        overflow: auto;
      }
    `};

  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
`

const Table = styled.table<{ $sticky?: boolean }>`
  width: 98%;
  margin-left: auto;
  margin-right: auto;
  ${({ $sticky }) =>
    $sticky &&
    css`
      thead {
        top: 0;
        position: sticky;
        z-index: 1;
        width: fit-content;
        background-color: ${theme.primaryBlack};
      }
    `};

  thead {
    th {
      min-width: 120px;
      vertical-align: top;
      padding: 20px;
    }
    tr {
      color: ${theme.grey100};
      font-weight: bold;
      font-size: 16px;
    }
  }
  tbody {
    font-size: 14px;
    tr {
      color: ${theme.grey70};
      box-shadow: inset 0px 0px 0px 1px ${theme.grey20};
      td {
        padding: 20px;
      }
    }
  }
`

const DataTable = <Data extends object>({
  columns,
  data,
  getCellProps,
  hideHeaders = false,
  paging,
  renderRowSubComponent,
  rowComponent,
  initialState,
  mRef,
  sticky,
}: DataTableProps<Data>) => {
  const defaultColumn = {
    Filter: '',
  }
  const instance = useTable<Data>(
    {
      defaultColumn,
      autoResetExpanded: false,
      columns,
      data,
      expandSubRows: false,
      initialState,
      disableSortRemove: true,
      autoResetFilters: false,
    },
    useFilters,
    useSortBy,
    useExpanded,
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = instance

  useImperativeHandle(mRef, () => instance)

  useEffect(() => {
    if (sticky) {
      document.body.classList.add('overflow-y-hidden')
      return () => {
        document.body.classList.remove('overflow-y-hidden')
      }
    }
  }, [sticky])

  const elDistanceToTop =
    window.scrollY +
    (document.getElementById('tableContainer')?.getBoundingClientRect()?.top ||
      0)

  const [top, setTop] = useState(200)
  useEffect(() => {
    setTop(elDistanceToTop)
  }, [elDistanceToTop])

  return (
    <TableContainer $sticky={sticky} $topDistance={top} id="tableContainer">
      <DataLoader
        paging={
          paging && {
            dataLength: data.length,
            loader: (
              <DataTable
                columns={columns}
                data={paging.loadingContent}
                hideHeaders
              />
            ),
            hasMore: () => !!paging?.hasMore(),
            getNext: () => {
              paging?.getNext()
            },
            scrollableTarget: paging.scrollableTarget || 'scrollTarget',
          }
        }
      >
        <div className="scrollTarget" id="scrollTarget">
          <Table $sticky={sticky} {...getTableProps()}>
            {!hideHeaders && <TableHeader headerGroups={headerGroups} />}
            <TableBody
              getCellProps={getCellProps}
              getTableBodyProps={getTableBodyProps}
              prepareRow={prepareRow}
              renderRowSubComponent={renderRowSubComponent}
              rowComponent={rowComponent}
              rows={rows}
              visibleColumns={visibleColumns}
            />
          </Table>
        </div>
      </DataLoader>
    </TableContainer>
  )
}

/*eslint-disable @typescript-eslint/no-empty-object-type */
// Must use module declaration augmentation to type the useSortBy and useExpanded plugins
// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table#configuration-using-declaration-merging
declare module 'react-table' {
  export interface TableOptions<D extends object>
    extends UseExpandedOptions<D>,
      UseSortByOptions<D>,
      UseFiltersOptions<D> {}
  export interface Hooks<D extends object = {}>
    extends UseExpandedHooks<D>,
      UseSortByHooks<D> {}
  export interface TableInstance<D extends object = {}>
    extends UseExpandedInstanceProps<D>,
      UseSortByInstanceProps<D>,
      UseFiltersInstanceProps<D> {}
  export interface TableState<D extends object = {}>
    extends UseExpandedState<D>,
      UseSortByState<D>,
      UseFiltersState<D> {}
  export interface ColumnInterface<D extends object = {}>
    extends UseSortByColumnOptions<D>,
      UseFiltersColumnOptions<D> {
    // DataTable-specific properties
    style?: {
      cellWidth?: string | number
      headerCell?: React.CSSProperties
    }
  }
  export interface ColumnInstance<D extends object = {}>
    extends UseSortByColumnProps<D>,
      UseFiltersColumnProps<D> {
    // DataTable-specific properties
    style?: {
      cellWidth?: string | number
      headerCell?: React.CSSProperties
    }
  }
  export interface Cell<D extends object = {}>
    extends UseRowStateCellProps<D> {}
  export interface Row<D extends object = {}> extends UseExpandedRowProps<D> {}
}
/*eslint-enable @typescript-eslint/no-empty-object-type */
export default DataTable
