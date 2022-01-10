# ts-paginate

This lib paginate any data as array of records using id attribute as cursor.

> All record must have id attribute or you must provide a custom cursorKey.

Install `npm install ts-paginate` or `yarn add ts-paginate`

## Custom Configs

default cursorKey: `id` and default pageSize: `25`

```ts

import { Pager } from 'ts-paginate';

// custom config
const paginate = new Pager({ cursorKey: '_id', pageSize: 15 }).paginate;


```

## Example Rest

```ts

import { Pager } from 'ts-paginate';

// set pager
const paginate = new Pager().paginate;

// using after cursor
const result = paginate({
	data: dbData,
	params: {
		size: 7,
		after: 'cursor_xyz'
	}
}).toRest();

console.log(result.pageInfo);
`{
	hasNextPage: true,
	hasPreviousPage: true,
	totalCount: 40,
	cursor: 'cursor_xyz'
}`

// using before cursor
const result = paginate({
	data: dbData,
	params: {
		size: 7,
		before: 'cursor_xyz'
	}
}).toRest();

```

## Data as GQL node

Transform data payload to graphQL node

```ts

import { Pager } from 'ts-paginate';

// set pager
const paginate = new Pager().paginate;

const result = paginate({
	data: usersData,
	params: {
		size: 50,
		after: 'cursor_xyz'
	}
}).toGql();

console.log(result.data[0]);
`{
	cursor: 'cursor_xyw',
	node: {
		id: 'cursor_xyw',
		name: 'foo',
		email: 'foo@mail.com'
	}
}`

```


## Generic types

Transform data payload to graphQL node

```ts

import { Pager } from 'ts-paginate';

interface IUser {
	id: string;
	name: string;
	email: string;
}

// set pager
const paginate = new Pager().paginate;

const result = paginate({ data: usersData }).toRest<IUser>();

// or 

const result = paginate({ data: usersData }).toGql<IUser>();

```
