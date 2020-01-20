export class Table {

  name?: string
  columns: Column[] = []
  rows: Row[] = []

  constructor(name?: string) {
    this.name = name
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

    for (let row of rows) {
      if (row == undefined) {
        continue
      }

      let tableRow = new Row()
      tableRow.table = this

      if (row instanceof Row) {

      }
      // add an arbitrary object
      else {
        tableRow.sourceObject = row

        if (this.columns) {
          for (let column of this.columns) {
            if (column.name && column.name in row) {
              tableRow.add(column, row[column.name])
            }
            else {
              tableRow.add(column)
            }
          }
        }
        else {
  
        }  
      }

      this.rows.push(tableRow)
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
  cell?: (value: any) => Cell

  constructor(nameOrObject?: string, objectNameOrCell?: string|((value: any) => Cell), cell?: (value: any) => Cell) {
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
  sourceObject?: any
  cells: Cell[] = []
  
  add(valueOrCellOrColumnOrColumnName: any|Cell|Column|string, valueOrCell?: any|Cell) {
    let column = undefined
    let columnName = undefined
    let cell = undefined
    let value = undefined

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

    if (cell) {
      value = cell.value
    }

    if (columnName != undefined && this.table) {
      column = this.table.getColumn(columnName)
    }

    if (column && typeof column.cell === 'function') {
      cell = column.cell(value)
    }

    if (cell == undefined) {
      cell = new Cell(value)
    }

    cell.column = column
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