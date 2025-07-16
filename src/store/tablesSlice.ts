import {
  createEntityAdapter,
  PayloadAction,
  createSlice
} from '@reduxjs/toolkit'

export type Table = {
  id: number
  position: number
  cells: (string | number)[][]
}

const tables: Table[] = [
  {
    id: 123,
    position: 0,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', 24, 'New York'],
      ['tandy', 'miller', 40, 'Los Angeles'],
      ['joe', 'dirte', 45, 'New Jersey']
    ]
  },
  {
    id: 345,
    position: 1,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', 24, 'New York'],
      ['tandy', 'miller', 40, 'Los Angeles'],
      ['joe', 'dirte', 45, 'New Jersey']
    ]
  },
  {
    id: 678,
    position: 2,
    cells: [
      ['name', 'surname', 'age', 'city'], // Column names
      ['tanner', 'linsley', 24, 'New York'],
      ['tandy', 'miller', 40, 'Los Angeles'],
      ['joe', 'dirte', 45, 'New Jersey']
    ]
  },
  {
    id: 912,
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
      const newTable = { ...action.payload, id: Date.now() }
      return tablesAdapter.addOne(state, newTable)
    }),
    // addTable: tablesAdapter.addOne,
    updateTable: tablesAdapter.updateOne,
    removeTable: tablesAdapter.removeOne,
    copyTable: create.reducer((state, action: PayloadAction<number>) => {
      const existingEntity = state.entities[action.payload]
      if (existingEntity) {
        const newId = Date.now()
        const updatedEntity = {
          ...existingEntity
          // order: existingEntity.order + 1
        }
        return tablesAdapter.updateOne(state, {
          id: newId,
          changes: updatedEntity
        })
      }
      return state
    }),
    copyTableAlternative: create.reducer(
      (state, action: PayloadAction<number>) => {
        const originalEntity = state.entities[action.payload]
        if (originalEntity) {
          const newEntity: Table = { ...originalEntity, id: Date.now() }
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
  copyTable,
  copyTableAlternative
} = tablesSlice.actions

export const {
  selectById: selectTableById,
  selectIds: selectTableIds,
  selectEntities: selectTableEntities,
  selectAll: selectAllTables,
  selectTotal: selectTotalTables
} = tablesAdapter.getSelectors((state) => state.tables)
