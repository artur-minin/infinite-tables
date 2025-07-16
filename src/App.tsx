import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { SlotItemMapArray, Swapy, utils, createSwapy } from 'swapy'

import { DataTable } from '@/components/data-table.tsx'
import { ProfileForm } from '@/components/example-form.tsx'
import { ModeToggle } from '@/components/mode-toggle.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu.tsx'
import { selectAllTables, swapTablePositions, useAppDispatch } from '@/store'

function App() {
  const [items, setItems] = useState<TableType[]>(tables)
  const dispatch = useAppDispatch()
  const tables = useSelector(selectAllTables)

  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(tables, 'id')
  )
  const slottedItems = useMemo(
    () => utils.toSlottedItems(tables, 'id', slotItemMap),
    [tables, slotItemMap]
  )
  const swapyRef = useRef<Swapy | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapyRef.current,
        tables,
        'id',
        slotItemMap,
        setSlotItemMap
      ),
    [tables]
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
          return item?.id ? (
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
                <DataTable tableId={item.id} />
              </div>
            </div>
          ) : null
        })}
      </div>
    </div>
  )
}

export default App
