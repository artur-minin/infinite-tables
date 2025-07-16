import { DraggableTables } from '@/components/draggable-tables.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'

export default function App() {
  return (
    <div>
      <DraggableTables />

      <Toaster
        swipeDirections={['top', 'right', 'left']}
        richColors
        duration={2000}
        position="top-center"
        offset="16px"
        gap={7}
      />
    </div>
  )
}
