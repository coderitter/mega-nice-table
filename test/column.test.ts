import { expect } from 'chai'
import 'mocha'
import { Column, Table } from '../src/table'

describe('Column', function() {
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