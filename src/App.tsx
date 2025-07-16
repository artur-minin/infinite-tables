import { useEffect, useMemo, useRef, useState } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import { SlotItemMapArray, Swapy, utils, createSwapy } from 'swapy'

import Table, { Person } from '@/components/Table'

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

type Table = {
  id: number
  name: string
}

const tables: Table[] = [
  {
    id: 1,
    name: 'Table 1'
  },
  {
    id: 2,
    name: 'Table 2'
  },
  {
    id: 3,
    name: 'Table 3'
  },
  {
    id: 4,
    name: 'Table 4'
  }
]

function App() {
  const columnHelper = createColumnHelper<Person>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => <span>Name</span>
      }),
      columnHelper.accessor('surname', {
        header: () => <span>Surname</span>
      }),
      columnHelper.accessor('age', {
        header: () => <span>Age</span>
      }),
      columnHelper.accessor('city', {
        header: () => <span>City</span>
      })
    ],
    [columnHelper]
  )

  const [items, setItems] = useState<Table[]>(tables)
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(items, 'name')
  )
  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, 'name', slotItemMap),
    [items, slotItemMap]
  )
  const swapyRef = useRef<Swapy | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapyRef.current,
        items,
        'name',
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
    <div
      ref={containerRef}
      className="flex flex-wrap gap-[var(--gap-between-tables)] p-4"
    >
      {slottedItems.map(({ slotId, itemId, item }) => (
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
            <Table columns={columns} initialData={defaultData} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
