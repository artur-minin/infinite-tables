import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>
  }

  return (
    <Button
      variant="ghost"
      className={className}
      onClick={() => column.toggleSorting()}
    >
      <span className="mr-2">{title}</span>
      {column.getIsSorted() === 'desc' ? (
        <ArrowDown className="size-4" />
      ) : column.getIsSorted() === 'asc' ? (
        <ArrowUp className="size-4" />
      ) : (
        <ArrowUpDown className="size-4 opacity-0" />
      )}
    </Button>
  )
}
