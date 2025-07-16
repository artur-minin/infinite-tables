import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { SlotItemMapArray, Swapy, utils, createSwapy } from 'swapy'

import { DataTable } from '@/components/data-table'
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

  useEffect(() => {
    utils.dynamicSwapy(
      swapyRef.current,
      tables,
      'id',
      slotItemMap,
      setSlotItemMap
    )
  }, [tables])

  useEffect(() => {
    // Reinitialize slotItemMap when tables change (e.g., when a table is copied)
    swapyRef?.current?.update()
    setSlotItemMap(utils.initSlotItemMap(tables, 'id'))
  }, [tables.length])

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

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap gap-[var(--gap-between-tables)]"
    >
      {slottedItems.map(({ slotId, itemId, item }) => {
        return item?.id ? (
          <div
            key={slotId}
            data-swapy-slot={slotId}
            className="min-w-[var(--table-width)] flex-1 cursor-grab"
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
  )
}
