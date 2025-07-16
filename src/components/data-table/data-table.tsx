import { useMemo, FocusEvent, memo, useState } from 'react'
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog.tsx'
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip.tsx'
import {
  copyTable,
  removeTable,
  selectTableDataById,
  updateTableCell
} from '@/store'

import { DataTableColumnHeader } from './data-table-column-header.tsx'

interface DataTableProps {
  tableId: string
  onCopy?: (tableId: string) => void
  onDelete?: (tableId: string) => void
}

export const DataTable = memo(function DataTable({
  tableId,
  onCopy,
  onDelete
}: DataTableProps) {
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
        const onBlur = (event: FocusEvent<HTMLInputElement>) => {
          dispatch(
            updateTableCell({
              tableId: tableId,
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

        const handleCopyTable = () => {
          dispatch(copyTable(tableId))
          onCopy?.(tableId)
        }

        const handleDeleteTable = () => {
          dispatch(removeTable(tableId))
          onDelete?.(tableId)
        }

        return (
          <div className="flex items-center justify-between">
            <DataTableColumnHeader
              column={column}
              title={column.id}
              className="cursor-pointer"
            />

            {isLastColumn && (
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      className="cursor-pointer"
                      onClick={handleCopyTable}
                    >
                      <File className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy table</p>
                  </TooltipContent>
                </Tooltip>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" className="cursor-pointer">
                          <Trash className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete table</p>
                      </TooltipContent>
                    </Tooltip>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        You are about to delete the table
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer"
                        onClick={handleDeleteTable}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        )
      }
    }),
    [dispatch, onCopy, onDelete, tableId]
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
})
