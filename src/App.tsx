import * as React from 'react'
import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import Table, { Person } from '@/components/Table'

const defaultData: Person[] = [
  {
    name: 'tanner',
    surname: 'linsley',
    age: 24,
    city: 'New York'
  },
  {
    name: 'tandy',
    surname: 'miller',
    age: 40,
    city: 'Los Angeles'
  },
  {
    name: 'joe',
    surname: 'dirte',
    age: 45,
    city: 'New Jersey'
  }
]

function App() {
  const [data, _setData] = React.useState(() => [...defaultData])
  const columnHelper = createColumnHelper<Person>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => <span>Name</span>
      }),
      columnHelper.accessor('surname', {
        header: () => <span>Surname</span>
      }),
      columnHelper.accessor('age', {
        header: () => <span>Age</span>
      }),
      columnHelper.accessor('city', {
        header: () => <span>City</span>
      })
    ],
    [columnHelper]
  )

  return (
    <div className="flex flex-wrap gap-[var(--gap-between-columns)] p-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={`column-${i}`}
          className="flex-basis[var(--one-column-width)] flex-1"
        >
          <Table columns={columns} data={data} />
        </div>
      ))}
    </div>
  )
}

export default App
