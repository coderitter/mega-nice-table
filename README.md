# Mega Nice Table

## Install

`npm install mega-nice-tabe`

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
  { id: 1, name: 'Bernd', email: 'berd@email.com' },
  { id: 1, name: 'Bert', email: 'bert@email.com' },
)
```