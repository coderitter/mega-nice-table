# Mega Nice Table

## Install

`npm install mega-nice-table`

## Overview

### Create a table

```typescript
let table = new Table

table.addColumns(
  'id',
  new Column('name', 'Name'),
  { name: 'email', title: 'Email' }
)
```

### Add Rows

```typescript
table.add(
  { id: 1, name: 'Berd', email: 'berd@email.com' },
  { id: 1, name: 'Bert', email: 'bert@email.com' },
)
```

### Column ids

```typescript
let column = new Column('name')
column.id == 'name'

let table = new Table('PersonTable')
table.add(column)
column.id == 'PersonTable.name'

column.objectName = 'Person'
column.id == 'Person.name'
```

### Pagination

```typescript
let table = new Table
table.add({'name': 'Berd'}, {'name': 'Bert'})

table.rowsPerPage = 10
table.currentPage = 0
table.pageCount == 1
table.pages == [1]

// you can also set the number if rows manually which is useful for only partially filled tables
table.rowCount = 100
table.currentPage = 4
table.pageCount == 10
table.pages == [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```