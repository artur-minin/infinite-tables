import { useSelector } from 'react-redux'

import { CreateTableButton } from '@/components/create-table-button.tsx'
import { DraggableTables } from '@/components/draggable-tables.tsx'
import { ThemeSelector } from '@/components/theme-selector.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { selectAllTables } from '@/store'

export default function App() {
  const tables = useSelector(selectAllTables)

  return (
    <div className="px-12 py-5">
      <div className="mb-16 flex items-center justify-between">
        <CreateTableButton />

        <ThemeSelector />
      </div>

      {tables.length ? (
        <DraggableTables />
      ) : (
        <h1 className="text-primary text-center text-4xl font-extrabold tracking-tight">
          Lets create your first table!
        </h1>
      )}

      <Toaster
        swipeDirections={['top', 'right', 'left']}
        duration={2000}
        position="top-center"
        offset="16px"
        gap={7}
        visibleToasts={3}
      />
    </div>
  )
}
