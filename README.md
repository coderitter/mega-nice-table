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