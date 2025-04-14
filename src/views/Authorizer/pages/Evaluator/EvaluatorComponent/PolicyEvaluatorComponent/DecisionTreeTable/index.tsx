import React from 'react'
import { CellProps, Column } from 'react-table'

import {
  Cell,
  CellOverflow,
  CodeCell,
  DecisionTreeTableWrapper,
  ModuleCell,
} from './styles'

import { V2DecisionTreeResponse } from '../../../../../../../types/authorizer'
import Highlight from '../../../../../../../components/common/Highlight'
import DataTable from '../../../../../../../components/common/DataTable'
interface DecisionTreeTableProps {
  data: V2DecisionTreeResponse
}

interface TableData {
  module: string
  decision: string
}

const columns: Column<TableData>[] = [
  {
    Header: 'Module',
    style: {
      cellWidth: '70%',
    },
    Cell: ({ row }: CellProps<TableData>) => (
      <Cell>
        <ModuleCell {...row.getToggleRowExpandedProps()}>
          <CellOverflow>{row.original.module}</CellOverflow>
        </ModuleCell>
      </Cell>
    ),
  },
  {
    Header: 'Decision',
    style: {
      cellWidth: '30%',
    },
    Cell: ({ row }: CellProps<TableData>) => (
      <Cell>
        <CodeCell {...row.getToggleRowExpandedProps()}>
          <Highlight language="json">{row.original.decision}</Highlight>
        </CodeCell>
      </Cell>
    ),
  },
]

export const DecisionTreeTable: React.FC<DecisionTreeTableProps> = ({
  data,
}) => {
  const list = Object.keys(data.path!).map((module) => {
    return {
      module,
      decision: JSON.stringify(data.path![module], null, 1)
        .replace('\n}', ' }')
        .replace('{\n', '{')
        .replace(/,\n/g, ','),
    }
  })

  return (
    <DecisionTreeTableWrapper>
      <DataTable columns={columns} data={list} sticky={true} />
    </DecisionTreeTableWrapper>
  )
}
