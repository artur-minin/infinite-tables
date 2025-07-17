'use client'

import { useState, useMemo } from 'react'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { File, Trash } from 'lucide-react'

import { DataTableColumnHeader } from '@/components/data-table-column-header.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

interface DataTableProps<TData> {
  columns?: string[]
  data: TData[]
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])

  // const columnsFormatted = columns.map((name) => ({
  //   accessorKey: name
  // }))

  const columnsFormatted = (Object.keys(data?.[0] ?? {}) ?? []).map((name) => ({
    accessorKey: name
  }))

  const defaultColumn = useMemo<Partial<ColumnDef<TData>>>(
    () => ({
      cell: ({
        getValue,
        row: { index: rowIndex },
        column: { id: columnId, getIndex: getColumnIndex },
        table
      }) => {
        const initialValue = getValue()
        const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
          const columnIndex = getColumnIndex()
          table.options.meta?.updateData(rowIndex, columnId, event.target.value)
        }

        return (
          <Input
            className="min-h-12 w-full"
            defaultValue={initialValue as string}
            onBlur={onBlur}
          />
        )
      },
      header: ({ column, header }) => {
        const isLastColumn =
          header.index === header.headerGroup.headers.length - 1

        return (
          <div className="flex items-center justify-between">
            <DataTableColumnHeader
              column={column}
              title={column.id}
              className="cursor-pointer"
            />

            {isLastColumn && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" className="cursor-pointer">
                  <Trash className="size-4" />
                </Button>

                <Button variant="ghost" className="cursor-pointer">
                  <File className="size-4" />
                </Button>
              </div>
            )}
          </div>
        )
      }
    }),
    []
  )

  const table = useReactTable({
    data,
    columns: columnsFormatted,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    }
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnsFormatted.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
