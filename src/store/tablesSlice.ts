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
  sortComparer: (a, b) =>
    a.position.toString().localeCompare(b.position.toString())
})

export const tablesSlice = createSlice({
  name: 'tables',
  initialState: tablesAdapter.setAll(tablesAdapter.getInitialState(), tables),
  reducers: (create) => ({
    addTable: create.reducer((state, action: PayloadAction<string[]>) => {
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
    copyTable: create.reducer((state, action: PayloadAction<string>) => {
      const originalTable = state.entities[action.payload]
      if (originalTable) {
        console.log({ originalTablePosition: originalTable.position })
        const newTable: Table = {
          ...originalTable,
          id: Date.now().toString(),
          position: originalTable.position + 1
        }
        return tablesAdapter.addOne(state, newTable)
      }

      return state
    }),
    removeTable: tablesAdapter.removeOne,
    updateTableCell: create.reducer(
      (
        state,
        action: PayloadAction<{
          tableId: string
          rowIndex: number
          columnIndex: number
          value: string | number
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
          tableId1: string
          tableId2: string
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

export const selectTableDataById = (tableId: string) => (state: RootState) => {
  const table = selectTableById(state, tableId)
  if (!table) return []

  return table.cells
}

export const { selectById: selectTableById, selectAll: selectAllTables } =
  tablesAdapter.getSelectors((state: RootState) => state.tables)
