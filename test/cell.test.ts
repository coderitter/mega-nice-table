import { expect } from 'chai'
import 'mocha'
import { Cell, Column, Table } from '../src/table'

describe('Cell', function() {
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
