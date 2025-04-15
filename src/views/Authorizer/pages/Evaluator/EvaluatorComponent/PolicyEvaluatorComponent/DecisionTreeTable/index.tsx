import React from 'react'
import { CellProps, Column } from 'react-table'

import DataTable from '../../../../../../../components/common/DataTable'
import Highlight from '../../../../../../../components/common/Highlight'
import { V2DecisionTreeResponse } from '../../../../../../../types/authorizer'
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

const columns: Column<TableData>[] = [
  {
    Cell: ({ row }: CellProps<TableData>) => (
      <Cell>
        <ModuleCell {...row.getToggleRowExpandedProps()}>
          <CellOverflow>{row.original.module}</CellOverflow>
        </ModuleCell>
      </Cell>
    ),
    Header: 'Module',
    style: {
      cellWidth: '70%',
    },
  },
  {
    Cell: ({ row }: CellProps<TableData>) => (
      <Cell>
        <CodeCell {...row.getToggleRowExpandedProps()}>
          <Highlight language="json">{row.original.decision}</Highlight>
        </CodeCell>
      </Cell>
    ),
    Header: 'Decision',
    style: {
      cellWidth: '30%',
    },
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

  return (
    <DecisionTreeTableWrapper>
      <DataTable columns={columns} data={list} sticky={true} />
    </DecisionTreeTableWrapper>
  )
}
