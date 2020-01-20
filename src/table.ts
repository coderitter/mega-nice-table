export class Table {

  name?: string
  columns: Column[] = []
  rows: Row[] = []

  addColumns(...columns: any[]) {
    for (let column of columns) {
      if (typeof column === 'string') {
        this.columns.push(new Column(column))
      }
      else if (column instanceof Column) {
        this.columns.push(column)
      }
      else if (typeof column === 'object') {
        this.columns.push(new Column(column.name, column.title))
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
  name?: string
  title?: string

  constructor(name?: string, title?: string) {
    this.name = name
    this.title = title
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