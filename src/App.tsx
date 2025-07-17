import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { SlotItemMapArray, Swapy, utils, createSwapy } from 'swapy'

import { DataTable } from '@/components/data-table.tsx'
import { ProfileForm } from '@/components/example-form.tsx'
import { ModeToggle } from '@/components/mode-toggle.tsx'
import type { Person } from '@/components/Table'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu.tsx'
import { selectAllTables, selectTotalTables } from '@/store'

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

type TableType = {
  id: number
  data: Person[]
}

const tables: TableType[] = [
  {
    id: 123,
    data: defaultData
  },
  {
    id: 345,
    data: defaultData
  },
  {
    id: 678,
    data: defaultData
  },
  {
    id: 912,
    data: defaultData
  }
]

function App() {
  const [items, setItems] = useState<TableType[]>(tables)
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(items, 'id')
  )
  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, 'id', slotItemMap),
    [items, slotItemMap]
  )
  const swapyRef = useRef<Swapy | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const tablesTotalRedux = useSelector(selectTotalTables)
  const tablesRedux = useSelector(selectAllTables)

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapyRef.current,
        items,
        'id',
        slotItemMap,
        setSlotItemMap
      ),
    [items]
  )

  useEffect(() => {
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
      animation: 'dynamic',
      autoScrollOnDrag: true
    })

    swapyRef.current.onSwap((event) => {
      setSlotItemMap(event.newSlotItemMap.asArray)
    })

    return () => {
      swapyRef.current?.destroy()
    }
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="default" className="capitalize">
              create table
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="px-4 py-5">
            <ProfileForm />
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />
      </div>

      <div
        ref={containerRef}
        className="flex flex-wrap gap-[var(--gap-between-tables)] p-4"
      >
        {slottedItems.map(({ slotId, itemId, item }) => {
          console.log({ slotId, itemId, item })
          return (
            <div
              key={slotId}
              data-swapy-slot={slotId}
              className="min-w-[var(--table-width)] flex-1 cursor-grab [&[data-swapy-highlighted]]:bg-green-200"
            >
              <div
                key={itemId}
                data-swapy-item={itemId}
                className="[&[data-swapy-dragging]]:cursor-grabbing"
              >
                <DataTable data={defaultData} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
