'use client'

import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
import { selectTableDataById, updateTableCell } from '@/store'

interface DataTableProps {
  tableId: string
}

export function DataTable({ tableId }: DataTableProps) {
  const dispatch = useDispatch()

  const [sorting, setSorting] = useState<SortingState>([])
  const tableData = useSelector(selectTableDataById(tableId))

  const tableColumns = useMemo(() => tableData[0] || [], [tableData])
  const tableHeaderCells = useMemo(() => {
    return tableColumns.map((columnName) => ({
      accessorKey: columnName.toString()
    }))
  }, [tableColumns])

  const tableBodyCells = useMemo(() => {
    return (tableData.slice(1) || []).map((row) => {
      return row.reduce<Record<string, string | number>>(
        (acc, cellData, cellIndex) => {
          acc[tableColumns[cellIndex]] = cellData
          return acc
        },
        {}
      )
    })
  }, [tableData, tableColumns])

  const defaultColumn = useMemo<
    Partial<ColumnDef<Record<string, string | number>>>
  >(
    () => ({
      cell: ({
        getValue,
        row: { index: rowIndex },
        column: { getIndex: getColumnIndex }
      }) => {
        const initialValue = getValue<string>()
        const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
          dispatch(
            updateTableCell({
              tableId: Number(tableId),
              rowIndex: rowIndex + 1,
              columnIndex: getColumnIndex(),
              value: event.target.value
            })
          )
        }

        return (
          <Input
            className="min-h-12 w-full"
            defaultValue={initialValue}
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
    [dispatch, tableId]
  )

  const table = useReactTable({
    columns: tableHeaderCells,
    data: tableBodyCells,
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
                colSpan={tableHeaderCells.length}
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
