import {
  createEntityAdapter,
  PayloadAction,
  createSlice
} from '@reduxjs/toolkit'

import { RootState } from '@/store/types.ts'

export type Table = {
  id: string
  position: number
  cells: (string | number)[][]
}

const tables: Table[] = [
  {
    id: '123',
    position: 0,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', 24, 'New York'],
      ['tandy', 'miller', 40, 'Los Angeles'],
      ['joe', 'dirte', 45, 'New Jersey']
    ]
  },
  {
    id: '345',
    position: 1,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', 24, 'New York'],
      ['tandy', 'miller', 40, 'Los Angeles'],
      ['joe', 'dirte', 45, 'New Jersey']
    ]
  },
  {
    id: '678',
    position: 2,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', 24, 'New York'],
      ['tandy', 'miller', 40, 'Los Angeles'],
      ['joe', 'dirte', 45, 'New Jersey']
    ]
  },
  {
    id: '912',
    position: 3,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', 24, 'New York'],
      ['tandy', 'miller', 40, 'Los Angeles'],
      ['joe', 'dirte', 45, 'New Jersey']
    ]
  }
]

const tablesAdapter = createEntityAdapter<Table>({
  sortComparer: (a, b) => a.position - b.position
})

export const tablesSlice = createSlice({
  name: 'tables',
  initialState: tablesAdapter.setAll(tablesAdapter.getInitialState(), tables),
  reducers: (create) => ({
    addTable: create.reducer((state, action: PayloadAction<Table>) => {
      const newTable = { ...action.payload, id: Date.now().toString() }
      return tablesAdapter.addOne(state, newTable)
    }),
    updateTable: tablesAdapter.updateOne,
    removeTable: tablesAdapter.removeOne,
    updateTableCell: create.reducer(
      (
        state,
        action: PayloadAction<{
          tableId: number
          rowIndex: number
          columnIndex: number
          value: string | number
        }>
      ) => {
        const { tableId, rowIndex, columnIndex, value } = action.payload
        const table = state.entities[tableId]

        const isCellExist = table?.cells[rowIndex]?.[columnIndex] !== undefined
        if (isCellExist) {
          table.cells[rowIndex][columnIndex] = value
        }
      }
    ),
    swapTablePositions: create.reducer(
      (
        state,
        action: PayloadAction<{
          tableId1: number
          tableId2: number
        }>
      ) => {
        const { tableId1, tableId2 } = action.payload
        const table1 = state.entities[tableId1]
        const table2 = state.entities[tableId2]

        if (table1 && table2) {
          const tempPosition = table1.position
          table1.position = table2.position
          table2.position = tempPosition
        }
      }
    ),
    copyTable: create.reducer((state, action: PayloadAction<number>) => {
      const existingEntity = state.entities[action.payload]
      if (existingEntity) {
        const updatedEntity = {
          ...existingEntity
          // order: existingEntity.order + 1
        }
        return tablesAdapter.updateOne(state, {
          id: Date.now().toString(),
          changes: updatedEntity
        })
      }
      return state
    }),
    copyTableAlternative: create.reducer(
      (state, action: PayloadAction<number>) => {
        const originalEntity = state.entities[action.payload]
        if (originalEntity) {
          const newEntity: Table = {
            ...originalEntity,
            id: Date.now().toString()
          }
          return tablesAdapter.addOne(state, newEntity)
        }
        return state
      }
    )
  })
})

export const {
  addTable,
  updateTable,
  removeTable,
  swapTablePositions,
  updateTableCell,
  copyTable,
  copyTableAlternative
} = tablesSlice.actions

// Add this selector to transform the normalized state into the format expected by DataTable
export const selectTableDataById = (tableId: string) => (state: RootState) => {
  const table = selectTableById(state, tableId)
  if (!table) return []

  // Return the data array directly as DataTable expects
  return table.cells
}

// Add a selector to get all tables in the format expected by DataTable
export const selectAllTablesFormatted = (state: RootState) => {
  const tables = selectAllTables(state)
  return tables.map((table) => ({
    id: table.id,
    position: table.position,
    data: table.cells
  }))
}

export const {
  selectById: selectTableById,
  selectIds: selectTableIds,
  selectEntities: selectTableEntities,
  selectAll: selectAllTables,
  selectTotal: selectTotalTables
} = tablesAdapter.getSelectors((state: RootState) => state.tables)
