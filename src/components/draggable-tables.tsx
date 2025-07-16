import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { toast } from 'sonner'
import { SlotItemMapArray, Swapy, utils, createSwapy } from 'swapy'

import { CreateTableButton } from '@/components/create-table-button.tsx'
import { DataTable } from '@/components/data-table'
import { ThemeSelector } from '@/components/theme-selector.tsx'
import { selectAllTables, swapTablePositions, useAppDispatch } from '@/store'

export function DraggableTables() {
  const dispatch = useAppDispatch()
  const tables = useSelector(selectAllTables)

  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(tables, 'id')
  )
  const slottedItems = useMemo(
    () => utils.toSlottedItems(tables, 'id', slotItemMap),
    [slotItemMap, tables]
  )
  const swapyRef = useRef<Swapy | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  console.log({ tables, slottedItems })

  useEffect(() => {
    utils.dynamicSwapy(
      swapyRef.current,
      tables,
      'id',
      slotItemMap,
      setSlotItemMap
    )

    // Reinitialize slotItemMap when tables change (e.g., when a table is copied)
    setSlotItemMap(utils.initSlotItemMap(tables, 'id'))
  }, [tables])

  useEffect(() => {
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
      animation: 'dynamic',
      autoScrollOnDrag: true
    })

    let draggingItem: string | null = null
    let swapWithItem: string | null = null

    swapyRef.current?.onBeforeSwap((event) => {
      draggingItem = event.draggingItem
      swapWithItem = event.swapWithItem
      return true
    })

    swapyRef.current.onSwap((event) => {
      setSlotItemMap(event.newSlotItemMap.asArray)
    })

    swapyRef.current?.onSwapEnd((event) => {
      if (event.hasChanged && draggingItem && swapWithItem) {
        dispatch(
          swapTablePositions({
            tableId1: draggingItem,
            tableId2: swapWithItem
          })
        )
      }

      draggingItem = null
      swapWithItem = null
    })

    return () => {
      swapyRef.current?.destroy()
    }
  }, [])

  const handleCreateTable = useCallback(() => {
    swapyRef?.current?.update()
    toast.success('Table has been created')
  }, [])

  const handleCopyTable = useCallback(() => {
    swapyRef?.current?.update()
    toast.success('Table has been copied')
  }, [])

  const handleDeleteTable = useCallback(() => {
    swapyRef?.current?.update()
    toast.success('Table has been deleted')
  }, [])

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <CreateTableButton onCreate={handleCreateTable} />

        <ThemeSelector />
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
                <DataTable
                  tableId={item.id}
                  onCopy={handleCopyTable}
                  onDelete={handleDeleteTable}
                />
              </div>
            </div>
          ) : null
        })}
      </div>
    </>
  )
}
