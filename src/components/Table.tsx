import { useEffect, useState } from 'react'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  GroupColumnDef,
  useReactTable
} from '@tanstack/react-table'

export type Person = {
  name: string
  surname: string
  age: number
  city: string
}

// now create types for props for this Table component(https://tanstack.com/table/latest/docs/framework/react/examples/sub-components)
type TableProps<TData> = {
  initialData: TData[]
  columns: GroupColumnDef<TData>[]
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Person>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return (
      <input
        className="w-full"
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    )
  }
}

export default function Table({ columns, initialData }: TableProps<Person>) {
  const [data, setData] = useState(() => [...initialData])

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value
              }
            }
            return row
          })
        )
      }
    }
  })

  return (
    <table className="w-full border-collapse">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="bg-blue-700 text-white">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border border-gray-200 p-3 text-left font-medium"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="bg-white">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border border-gray-200 p-3">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
