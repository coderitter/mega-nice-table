import { expect } from 'chai'
import 'mocha'
import { Column, Table, Cell, Row } from '../src/table'

describe('Table', function() {
  describe('addColumns', function() {
    it('should add columns', function() {
      let table = new Table
      
      table.addColumns(
        new Column('a'),
        new Column('b'),
      )

      expect(table.columns.length).to.equal(2)
      expect(table.columns[0].table).to.equal(table)
      expect(table.columns[0].name).to.equal('a')
      expect(table.columns[1].table).to.equal(table)
      expect(table.columns[1].name).to.equal('b')
    })

    it('should add column names', function() {
      let table = new Table
      
      table.addColumns('a', 'b')

      expect(table.columns.length).to.equal(2)
      expect(table.columns[0]).to.be.instanceOf(Column)
      expect(table.columns[0].table).to.equal(table)
      expect(table.columns[0].name).to.equal('a')
      expect(table.columns[1]).to.be.instanceOf(Column)
      expect(table.columns[1].table).to.equal(table)
      expect(table.columns[1].name).to.equal('b')

    })

    it('should add from anonymous column objects', function() {
      let table = new Table      
      
      table.addColumns(
        { name: 'a' },
        { name: 'b', title: 'B' }
      )

      expect(table.columns.length).to.equal(2)
      expect(table.columns[0]).to.be.instanceOf(Column)
      expect(table.columns[0].table).to.equal(table)
      expect(table.columns[0].name).to.equal('a')
      expect(table.columns[0].title).to.be.undefined
      expect(table.columns[1]).to.be.instanceOf(Column)
      expect(table.columns[1].table).to.equal(table)
      expect(table.columns[1].name).to.equal('b')
      expect(table.columns[1].title).to.equal('B')
    })

    it('should add a mixture of all parameter types', function() {
      let table = new Table      
      
      table.addColumns(
        'a',
        new Column('b', 'ObjectB'),
        { name: 'c', objectName: 'ObjectC', title: 'C' }
      )

      expect(table.columns.length).to.equal(3)
      expect(table.columns[0]).to.be.instanceOf(Column)
      expect(table.columns[0].table).to.equal(table)
      expect(table.columns[0].name).to.equal('a')
      expect(table.columns[0].title).to.be.undefined
      expect(table.columns[1]).to.be.instanceOf(Column)
      expect(table.columns[1].table).to.equal(table)
      expect(table.columns[1].name).to.equal('b')
      expect(table.columns[1].objectName).to.equal('ObjectB')
      expect(table.columns[2]).to.be.instanceOf(Column)
      expect(table.columns[2].table).to.equal(table)
      expect(table.columns[2].name).to.equal('c')
      expect(table.columns[2].objectName).to.equal('ObjectC')
      expect(table.columns[2].title).to.equal('C')
    })
  })

  describe('getColumn', function() {
    it('should get the column by name', function() {
      let table = new Table
      table.addColumns('a', 'aa', 'A')

      let column1 = table.getColumn('a')
      let column2 = table.getColumn('aa')
      let column3 = table.getColumn('A')

      expect(column1).to.not.be.undefined
      expect(column1?.name).to.equal('a')
      expect(column2).to.not.be.undefined
      expect(column2?.name).to.equal('aa')
      expect(column3).to.not.be.undefined
      expect(column3?.name).to.equal('A')
    })
  })

  describe('add', function() {
    it('should add arbitrary objects reading the properties according to the column names', function() {
      let table = new Table
      
      table.addColumns(
        new Column('a'),
        new Column('c.c1'),
      )

      table.add(
        { a: 'a1', b: 'b1', c: { c1: 'c11' }, d: 'd1' },
        { a: 'a2', b: 'b2', c: { c1: 'c12' }, d: 'd2' }
      )

      expect(table.rows.length).to.equal(2)
      expect(table.rows[0].rowData).to.deep.equal({ a: 'a1', b: 'b1', c: { c1: 'c11' }, d: 'd1' })
      expect(table.rows[0].cells.length).to.equal(2)
      expect(table.rows[0].cells[0].value).to.equal('a1')
      expect(table.rows[0].cells[1].value).to.equal('c11')
      expect(table.rows[1].rowData).to.deep.equal({ a: 'a2', b: 'b2', c: { c1: 'c12' }, d: 'd2' })
      expect(table.rows[1].cells.length).to.equal(2)
      expect(table.rows[1].cells[0].value).to.equal('a2')
      expect(table.rows[1].cells[1].value).to.equal('c12')
    })

    it('should create cells from the given cell factory on a column object', function() {
      let table = new Table

      table.addColumns(
        new Column('a', (value) => new Cell(value + 'x'))
      )

      table.add({ a: 'a' })

      expect(table.rows[0].cells[0].value).to.equal('ax')
    })
  })

  describe('clear', function() {
    it('should clear all rows', function() {
      let table = new Table
      let row = new Row

      table.add(row)
      table.clear()

      expect(table.rows.length).to.equal(0)
    })
  })

  describe('rowCount', function() {
    it('should count the rows according to the added rows', function() {
      let table = new Table
    
      table.add({ a: 'a1' })
      expect(table.rowCount).to.equal(1)

      table.add({ a: 'a2' })
      expect(table.rowCount).to.equal(2)
    })

    it('should use the row count that is set', function() {
      let table = new Table
      table.rowCount = 10
      table.add({ a: 'a1' }, { a: 'a2' })
      expect(table.rowCount).to.equal(10)
    })
  })

  describe('pageCount', function() {
    it('should calculate the correct page count', function() {
      let table = new Table
      table.rowsPerPage = 10

      table.rowCount = 100
      expect(table.pageCount).to.equal(10)

      table.rowCount = 105
      expect(table.pageCount).to.equal(11)
    })

    it('should return 1 if the rows per page is set to 0', function() {
      let table = new Table
      table.rowsPerPage = 0

      table.rowCount = 100
      expect(table.pageCount).to.equal(1)
    })
  })

  describe('pages', function() {
    it('should return the correct array of page numbers', function() {
      let table = new Table
      table.rowCount = 105
      table.rowsPerPage = 10

      let pages = table.pages
      expect(pages.length).to.equal(11)
      expect(pages[0]).to.equal(1)
      expect(pages[10]).to.equal(11)
    })
  })
})