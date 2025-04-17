import React from 'react'

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import DataTable from '../../../../../../components/common/DataTable'
import Highlight from '../../../../../../components/common/Highlight'
import { V2DecisionTreeResponse } from '../../../../../../types/authorizer'
import {
  Cell,
  CellOverflow,
  CodeCell,
  DecisionTreeTableWrapper,
  ModuleCell,
} from './styles'
interface DecisionTreeTableProps {
  data: V2DecisionTreeResponse
}

interface TableData {
  decision: string
  module: string
}

const columns: ColumnDef<TableData>[] = [
  {
    cell: ({ row }) => (
      <Cell>
        <ModuleCell>
          <CellOverflow>{row.original.module}</CellOverflow>
        </ModuleCell>
      </Cell>
    ),
    header: 'Module',
  },
  {
    cell: ({ row }) => (
      <Cell>
        <CodeCell>
          <Highlight language="json">{row.original.decision}</Highlight>
        </CodeCell>
      </Cell>
    ),
    header: 'Decision',
  },
]

export const DecisionTreeTable: React.FC<DecisionTreeTableProps> = ({
  data,
}) => {
  const list = Object.keys(data.path!).map((module) => {
    return {
      decision: JSON.stringify(data.path![module], null, 1)
        .replace('\n}', ' }')
        .replace('{\n', '{')
        .replace(/,\n/g, ','),
      module,
    }
  })

  const table = useReactTable({
    columns: columns,
    data: list,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DecisionTreeTableWrapper>
      <DataTable table={table} />
    </DecisionTreeTableWrapper>
  )
}
