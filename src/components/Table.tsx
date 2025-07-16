import {
  flexRender,
  getCoreRowModel,
  GroupColumnDef,
  useReactTable
} from '@tanstack/react-table'

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// now create types for props for this Table component(https://tanstack.com/table/latest/docs/framework/react/examples/sub-components)
type TableProps<TData> = {
  data: TData[]
  columns: GroupColumnDef<TData>[]
}

export default function Table({ columns, data }: TableProps<Person>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
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
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  )
}
