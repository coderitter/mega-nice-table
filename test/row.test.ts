import { expect } from 'chai'
import 'mocha'
import { Cell, Column, Table, Row } from '../src/table'

describe('Column', function() {
  describe('getCell', function() {
    it('should return the proper cell', function() {
      let row = new Row
      row.add('a', 'a1')

      let cell1 = row.getCell('a')
      let cell2 = row.getCell('b')

      expect(cell1).to.be.not.undefined
      expect(cell1?.value).to.equal('a1')
      expect(cell2).to.be.undefined
    })
  })
})
