export class Table {

  name?: string
  columns: Column[] = []
  rows: Row[] = []
  private _rowCount?: number
  rowsPerPage: number = 10
  currentPage: number = 1
  widget: TableWidget = {}

  constructor(name?: string) {
    this.name = name
  }

  get rowCount(): number {
    if (this._rowCount !== undefined) {
      return this._rowCount
    }

    if (Array.isArray(this.rows)) {
      return this.rows.length
    }
    
    return 0
  }

  set rowCount(rowCount: number) {
    this._rowCount = rowCount
  }

  get pageCount(): number {
    if (this.rowsPerPage > 0) {
      return Math.ceil(this.rowCount / this.rowsPerPage)
    }
    else {
      return 1
    }
  }

  get pages(): number[] {
    let pages: number[] = []

    for (let i = 1; i <= this.pageCount; i++) {
      pages.push(i)
    }

    return pages
  }

  addColumns(...columns: any[]) {
    for (let column of columns) {
      if (typeof column === 'string') {
        let tableColumn = new Column(column)
        tableColumn.table = this
        this.columns.push(tableColumn)
      }
      else if (column instanceof Column) {
        column.table = this
        this.columns.push(column)
      }
      else if (typeof column === 'object') {
        let tableColumn = new Column(column)
        tableColumn.table = this
        this.columns.push(tableColumn)
      }
    }
  }

  getColumn(name: string): Column|undefined {
    for (let column of this.columns) {
      if (column.name == name) {
        return column
      }  
    }
  }

  add(...rows: any) {
    // if an array was given which was not prefixed with the three dots (...) extract it
    if (rows.length == 1 && rows[0] instanceof Array) {
      rows = rows[0]
    }

    for (let rowData of rows) {
      if (rowData == undefined) {
        continue
      }

      let row

      if (rowData instanceof Row) {
        row = rowData
        row.table = this
      }
      // add an arbitrary object
      else {
        row = new Row()
        row.table = this
        row.rowData = rowData

        if (this.columns) {
          for (let column of this.columns) {
            if (column.name && column.name in rowData) {
              let value = extractValueFromColumn(rowData, column)
              row.add(column, value)
            }
            else {
              row.add(column)
            }
          }
        }
        else {
  
        }  
      }

      this.rows.push(row)
    }
  }

  clear() {
    for (let row of this.rows) {
      row.clear()
    }

    this.rows = []
  }
}

export class Column {

  table?: Table
  name?: string
  objectName?: string
  title?: string
  cell?: (value: any, rowObject: any, row: Row) => Cell

  constructor(nameOrObject?: string, objectNameOrCell?: string|((value: any, row: Row) => Cell), cell?: (value: any, row: Row) => Cell) {
    if (typeof nameOrObject === 'string') {
      this.name = nameOrObject
    }
    else if (typeof nameOrObject === 'object' && nameOrObject !== null) {
      let obj = <any> nameOrObject
      this.table = obj.table
      this.name = obj.name
      this.objectName = obj.objectName
      this.title = obj.title
      this.cell = obj.cell
    }

    if (typeof objectNameOrCell ==='string') {
      this.objectName = objectNameOrCell
      this.cell = cell
    }
    else if (typeof objectNameOrCell === 'function') {
      this.cell = objectNameOrCell
    }
  }

  get id(): string|undefined {
    if (this.objectName) {
      return this.objectName + '.' + this.name
    }

    if (this.table && this.table.name) {
      return this.table.name + '.' + this.name
    }

    return this.name
  }
}

export class Row {

  table?: Table
  rowData?: any
  cells: Cell[] = []
  
  add(valueOrCellOrColumnOrColumnName: any|Cell|Column|string, valueOrCell?: any|Cell) {
    let column: Column|undefined
    let columnName: string|undefined
    let cell: Cell|undefined
    let value: any = undefined

    if (valueOrCellOrColumnOrColumnName instanceof Cell) {
      cell = valueOrCellOrColumnOrColumnName
    }
    else if (valueOrCellOrColumnOrColumnName instanceof Column) {
      column = valueOrCellOrColumnOrColumnName
    }

    if (valueOrCell === undefined) {
      value = valueOrCellOrColumnOrColumnName
    }
    else {
      if (typeof valueOrCellOrColumnOrColumnName === 'string') {
        columnName = valueOrCellOrColumnOrColumnName
      }

      if (valueOrCell instanceof Cell) {
        cell = valueOrCell
      }
      else {
        value = valueOrCell
      }
    }

    if (columnName != undefined && this.table) {
      column = this.table.getColumn(columnName)
    }

    if (cell == undefined) {
      if (column && typeof column.cell === 'function') {
        cell = column.cell(value, this.rowData, this)
      }
      else {
        cell = new Cell(value)
      }
    }

    cell.column = column
    cell.row = this    

    this.cells.push(cell)
  }

  getCell(columnName: string): Cell|undefined {
    for (let cell of this.cells) {
      if (cell.column && cell.column.name == columnName) {
        return cell
      }
    }
  }

  clear() {
    for (let cell of this.cells) {
      cell.clear()
    }

    this.table = undefined // prevent memory leak
    this.cells = []
  }
}

export class Cell {

  column?: Column
  row?: Row
  value: any
  private _displayValue?: any
  
  constructor(value?: any, displayValue?: any) {
    this.value = value
    this._displayValue = displayValue
  }

  get displayValue(): any {
    if (this._displayValue !== undefined) {
      return this._displayValue
    }

    return this.value
  }

  set displayValue(displayValue: any) {
    this._displayValue = displayValue
  }

  clear() {
    this.column = undefined
    this.value = undefined
    this._displayValue = undefined
  }
}

export interface TableWidget {
  onPageClick?: (pageNumber: number) => void
}

export function extractValue(path: string, value: any): any {
  let splitName = path.split('.')
  let couldResolve = true
  let i

  for (i = 0; i < splitName.length; i++) {
    let namePart = splitName[i]

    if (namePart in value) {
      value = value[namePart]
    }
    else {
      couldResolve = false
      break
    }
  }

  if (i == splitName.length && couldResolve) {
    return value
  }
}

export function extractValueFromColumn(value: any, column?: Column): any {
  if (typeof value == 'object' && value !== null) {
    if (column && column.name) {
      return extractValue(column.name, value)
    }
    else {
      return value
    }
  }
  else {
    return value
  }
}
