import { expect } from 'chai'
import 'mocha'
import { Cell, Column, Table, Row } from '../src/table'

describe('Row', function() {
  describe('add', function() {
    it('should add a value', function() {
      let row = new Row
      row.add('a')
      
      expect(row.cells.length).to.equal(1)
      expect(row.cells[0]).to.be.instanceOf(Cell)
      expect(row.cells[0].value).to.equal('a')
    })

    it('should add a cell', function() {
      let row = new Row
      row.add(new Cell('a'))
      
      expect(row.cells.length).to.equal(1)
      expect(row.cells[0]).to.be.instanceOf(Cell)
      expect(row.cells[0].value).to.equal('a')
    })

    it('should add an empty cell for a column', function() {
      let row = new Row
      let column = new Column('a', () => new Cell('a1'))

      row.add(column)

      expect(row.cells.length).to.equal(1)
      expect(row.cells[0]).to.be.instanceOf(Cell)
      expect(row.cells[0].column).to.not.be.undefined
      expect(row.cells[0].column?.name).to.equal('a')
      expect(row.cells[0].value).to.equal('a1')
    })

    it('should add a value for a column', function() {
      let row = new Row
      let column = new Column('a')
      
      row.add(column, 'a1')
      
      expect(row.cells.length).to.equal(1)
      expect(row.cells[0]).to.be.instanceOf(Cell)
      expect(row.cells[0].column).to.not.be.undefined
      expect(row.cells[0].column?.name).to.equal('a')
      expect(row.cells[0].value).to.equal('a1')
    })

    it('should add a cell for a column', function() {
      let row = new Row
      let column = new Column('a')
      
      row.add(column, new Cell('a1'))
      
      expect(row.cells.length).to.equal(1)
      expect(row.cells[0]).to.be.instanceOf(Cell)
      expect(row.cells[0].column).to.not.be.undefined
      expect(row.cells[0].column?.name).to.equal('a')
      expect(row.cells[0].value).to.equal('a1')
    })

    it('should add a value for a column name', function() {
      let table = new Table
      table.addColumns(new Column('a'))
      
      let row = new Row
      row.table = table
      row.add('a', 'a1')

      expect(row.cells.length).to.equal(1)
      expect(row.cells[0]).to.be.instanceOf(Cell)
      expect(row.cells[0].column).to.not.be.undefined
      expect(row.cells[0].column?.name).to.equal('a')
      expect(row.cells[0].value).to.equal('a1')
    })
  })

  describe('getCell', function() {
    it('should return the proper cell', function() {
      let row = new Row
      row.add(new Column('a'), 'a1')

      let cell1 = row.getCell('a')
      let cell2 = row.getCell('b')

      expect(cell1).to.be.not.undefined
      expect(cell1?.value).to.equal('a1')
      expect(cell2).to.be.undefined
    })
  })

  describe('clear', function() {
    it('should clear the row appropriately', function() {
      let row = new Row
      row.add('a', new Cell)
      row.clear()
  
      expect(row.table).to.be.undefined
      expect(row.cells.length).to.equal(0)  
    })
  })
})
