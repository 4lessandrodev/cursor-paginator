# cursor-paginator

```ts

import { Paginator } from 'paginator';

// using after cursor
const result = Paginator({
	data: dbData,
	params: {
		size: 7,
		after: 'cursor_xyz'
	}
});

console.log(result.pageInfo);
{
	hasNextPage: true,
	hasPreviousPage: true,
	totalCount: 40,
	currentCursor: 'cursor_xyz',
	nextCursor: 'cursor_wxx',
	previousCursor: 'cursor_abc'
}

// using before cursor
const result = Paginator({
	data: dbData,
	params: {
		size: 7,
		before: 'cursor_xyz'
	}
});

```