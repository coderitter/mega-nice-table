import { expect } from 'chai'
import 'mocha'
import { Cell, Column, Table } from '../src/table'

describe('Column', function() {
  describe('constructor', function() {
    it('should accept a name and an objectName and a cell', function() {
      let column = new Column('a', 'Object', (value, row) => new Cell)

      expect(column.name).to.equal('a')
      expect(column.objectName).to.equal('Object')
      expect(column.cell).to.be.a('function')
    })

    it('should accept a name and a cell', function() {
      let column = new Column('a', (value) => new Cell)

      expect(column.name).to.equal('a')
      expect(column.cell).to.be.a('function')
    })
  })

  describe('id', function() {
    it('should have the desired id', function() {
      let column = new Column('a')
      expect(column.id).to.equal('a')

      let table = new Table
      table.addColumns(column)
      expect(column.id).to.equal('a')

      table.name = 'Table'
      expect(column.id).to.equal('Table.a')

      column.objectName = 'Object'
      expect(column.id).to.equal('Object.a')
    })
  })
})