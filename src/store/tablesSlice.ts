import {
  createEntityAdapter,
  PayloadAction,
  createSlice
} from '@reduxjs/toolkit'

import { Cell, Table } from '@/lib/types'
import { RootState } from '@/store/types.ts'

const tables: Table[] = [
  {
    id: '123',
    position: 2,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', '11', 'New York'],
      ['tandy', 'miller', '11', 'Los Angeles'],
      ['joe', 'dirte', '11', 'New Jersey']
    ]
  },
  {
    id: '345',
    position: 1,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', '22', 'New York'],
      ['tandy', 'miller', '22', 'Los Angeles'],
      ['joe', 'dirte', '22', 'New Jersey']
    ]
  },
  {
    id: '678',
    position: 0,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', '33', 'New York'],
      ['tandy', 'miller', '33', 'Los Angeles'],
      ['joe', 'dirte', '33', 'New Jersey']
    ]
  },
  {
    id: '912',
    position: 3,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', '44', 'New York'],
      ['tandy', 'miller', '44', 'Los Angeles'],
      ['joe', 'dirte', '44', 'New Jersey']
    ]
  }
]

const tablesAdapter = createEntityAdapter<Table>({
  sortComparer: (a, b) =>
    a.position.toString().localeCompare(b.position.toString())
})

export const tablesSlice = createSlice({
  name: 'tables',
  initialState: tablesAdapter.setAll(tablesAdapter.getInitialState(), tables),
  reducers: (create) => ({
    addTable: create.reducer((state, action: PayloadAction<Cell[]>) => {
      const tableHeader = action.payload
      const tableBody = Array(3)
        .fill(null)
        .map(() => Array(tableHeader.length).fill(''))

      return tablesAdapter.addOne(state, {
        id: Date.now().toString(),
        position: state.ids.length,
        cells: [tableHeader, ...tableBody]
      })
    }),
    copyTable: create.reducer((state, action: PayloadAction<Table['id']>) => {
      const copiedTable = state.entities[action.payload]
      if (copiedTable) {
        // Get all tables that need position increment
        const tablesToUpdate = Object.values(state.entities)
          .filter((table) => table && table.position > copiedTable.position)
          .map((table) => ({
            id: table.id,
            changes: { position: table.position + 1 }
          }))
        tablesAdapter.updateMany(state, tablesToUpdate)

        // Create and add the new table
        const newTable: Table = {
          ...copiedTable,
          id: Date.now().toString(),
          position: copiedTable.position + 1
        }
        return tablesAdapter.addOne(state, newTable)
      }
      return state
    }),
    removeTable: create.reducer((state, action: PayloadAction<Table['id']>) => {
      const tableId = action.payload
      const deletedTable = state.entities[tableId]
      if (!deletedTable) {
        return state
      }

      // Get all tables that need position decrement
      const tablesToUpdate = Object.values(state.entities)
        .filter((table) => table && table.position > deletedTable.position)
        .map((table) => ({
          id: table.id,
          changes: { position: table.position - 1 }
        }))
      tablesAdapter.updateMany(state, tablesToUpdate)

      return tablesAdapter.removeOne(state, tableId)
    }),
    updateTableCell: create.reducer(
      (
        state,
        action: PayloadAction<{
          tableId: Table['id']
          rowIndex: number
          columnIndex: number
          value: Cell
        }>
      ) => {
        const {
          tableId,
          rowIndex: rowIndexToUpdate,
          columnIndex: columnIndexToUpdate,
          value: updatedValue
        } = action.payload

        const table = state.entities[tableId]
        const isCellExist =
          table?.cells[rowIndexToUpdate]?.[columnIndexToUpdate] !== undefined
        if (!isCellExist) {
          return state
        }

        tablesAdapter.updateOne(state, {
          id: tableId,
          changes: {
            cells: table.cells.map((row, rowIndex) => {
              if (rowIndexToUpdate === rowIndex) {
                return row.map((oldValue, columnIndex) =>
                  columnIndexToUpdate === columnIndex ? updatedValue : oldValue
                )
              }

              return row
            })
          }
        })
      }
    ),
    swapTablePositions: create.reducer(
      (
        state,
        action: PayloadAction<{
          tableId1: Table['id']
          tableId2: Table['id']
        }>
      ) => {
        const { tableId1, tableId2 } = action.payload
        const table1 = state.entities[tableId1]
        const table2 = state.entities[tableId2]

        if (!table1 || !table2) {
          return state
        }

        tablesAdapter.updateMany(state, [
          { id: tableId1, changes: { position: table2.position } },
          { id: tableId2, changes: { position: table1.position } }
        ])
      }
    )
  })
})

export const {
  addTable,
  removeTable,
  swapTablePositions,
  updateTableCell,
  copyTable
} = tablesSlice.actions

export const selectTableDataById =
  (tableId: Table['id']) => (state: RootState) => {
    const table = selectTableById(state, tableId)
    if (!table) return []

    return table.cells
  }

export const { selectById: selectTableById, selectAll: selectAllTables } =
  tablesAdapter.getSelectors((state: RootState) => state.tables)
