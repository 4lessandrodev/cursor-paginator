# ts-paginate

This lib paginate any data as array of records using id attribute as cursor.

> All record must have id attribute.

Install `npm install ts-paginate` or `yarn add ts-paginate`

```ts

import { paginate } from 'ts-paginate';

// using after cursor
const result = paginate({
	data: dbData,
	params: {
		size: 7,
		after: 'cursor_xyz'
	}
});

console.log(result.pageInfo);
`{
	hasNextPage: true,
	hasPreviousPage: true,
	totalCount: 40,
	currentCursor: 'cursor_xyz',
	nextCursor: 'cursor_wxx',
	previousCursor: 'cursor_abc'
}`

// using before cursor
const result = paginate({
	data: dbData,
	params: {
		size: 7,
		before: 'cursor_xyz'
	}
});

```

## Data as node

Transform data payload to graphQL node

```ts

import { paginate, dataToNode } from 'ts-paginate';


const result = paginate({
	data: usersData,
	params: {
		size: 50,
		after: 'cursor_xyz'
	}
});

const nodes = dataToNode(result.data);

console.log(nodes[0]);
`{
	cursor: 'cursor_xyw',
	node: {
		id: 'cursor_xyw',
		name: 'foo',
		email: 'foo@mail.com'
	}
}`

```
