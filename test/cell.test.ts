import { expect } from 'chai'
import 'mocha'
import { Cell, Column } from '../src/table'

describe('Cell', function() {
  describe('setValue', function() {
    it('should extract the value from an object using the name of the set column', function() {
      let column = new Column('a.b')
      let cell = new Cell
      cell.column = column
      cell.setValue({ a: { b: 'b1' }})

      expect(cell.value).to.equal('b1')
    })
  })

  describe('displayValue', function() {
    it('should return the proper display value', function() {
      let cell = new Cell
      cell.value = 1
      expect(cell.displayValue).to.equal(1)

      cell.displayValue = '1 Euro'
      expect(cell.displayValue).to.equal('1 Euro')
    })
  })

  describe('clear', function() {
    it('should clear the cell appropriately', function() {
      let cell = new Cell
      cell.value = 1
      cell.displayValue = '1'
      cell.clear()
  
      expect(cell.value).to.be.undefined
      expect(cell.displayValue).to.be.undefined
    })
  })
})
