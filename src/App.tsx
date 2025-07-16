import * as React from 'react'
import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import Table, { Person } from '@/components/Table'

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10
  }
]

function App() {
  const [data, _setData] = React.useState(() => [...defaultData])
  const columnHelper = createColumnHelper<Person>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        cell: (info) => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
        footer: (info) => info.column.id
      }),
      columnHelper.accessor('age', {
        header: () => 'Age',
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id
      }),
      columnHelper.accessor('visits', {
        header: () => <span>Visits</span>,
        footer: (info) => info.column.id
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        footer: (info) => info.column.id
      }),
      columnHelper.accessor('progress', {
        header: 'Profile Progress',
        footer: (info) => info.column.id
      })
    ],
    [columnHelper]
  )

  return (
    <>
      {data && (
        <div className="p-2">
          <Table columns={columns} data={data} />
        </div>
      )}
    </>
  )
}

export default App
