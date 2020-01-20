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
        let tableColumn = new Column(column.name, column.title)
        tableColumn.table = this
        this.columns.push(tableColumn)
      }
    }
  }

  add(...rows: any) {
    //  convert to array
    if (! (rows instanceof Array)) {
      rows = [ rows ]
    }

    for (let row of rows) {
      let tableRow = new Row()

      if (row instanceof Row) {

      }
      // add an arbitrary object
      else {
        if (this.columns) {
          for (let column of this.columns) {
            if (column.name && column.name in row) {
              tableRow.add(column.name, row[column.name])
            }
          }
        }
        else {
  
        }  
      }

      this.rows.push(tableRow)
    }
  }
}

export class Column {

  table?: Table
  name?: string
  objectName?: string
  title?: string

  constructor(name?: string, title?: string) {
    this.name = name
    this.title = title
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
  columnToCell: {[columnName: string]: Cell} = {}
  
  get cells(): Cell[] {
    let cells: Cell[] = []
    for (let prop in this.columnToCell) {
      if (Object.prototype.hasOwnProperty.call(this.columnToCell, prop)) {
        cells.push(this.columnToCell[prop])
      }
    }

    return cells
  }

  add(columnName: string, value: any, displayValue?: string) {
    this.columnToCell[columnName] = new Cell(value, displayValue)
  }
}

export class Cell {
  value: any
  displayValue?: string

  constructor(value?: any, displayValue?: any) {
    this.value = value
    this.displayValue = displayValue
  }
}