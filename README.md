# ts-paginate

This lib paginate any data as array of records using id attribute as cursor.

> All record must have id attribute or you must provide a custom cursorKey.

Node
 Install

```shell

$ npm install --save ts-paginate

# or

$ yarn add ts-paginate

```

You also may use on browser from bundle

```html

<script src="https://cdn.jsdelivr.net/npm/ts-paginate@1.2.2/bundle/index.min.js"></script>

```

Or from skypack

```html

<script type="module">

	import { Pager } from 'https://cdn.skypack.dev/ts-paginate';

</script>

```

Follow link for browser example:
[Click Here](https://4lessandrodev.github.io/ts-paginate/examples/browser.html)

## Custom Configs

Default configs

```ts

{ cursorKey: 'id', pageSize: 25 }

```

```ts

import { Pager } from 'ts-paginate';

// default config
const paginate = new Pager().paginate;


```

Or using a custom config

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
		after: 'cursor_xya'
	}
}).toRest();

console.log(result.pageInfo);
`{
	hasNextPage: true,
	hasPreviousPage: true,
	totalCount: 40,
	sizePerPage: 7,
	currentItem: 1,
	page: {
		current: 2,
		of: 6
	},
	firstCursor: 'cursor_xyb',
	lastCursor: 'cursor_xyh'
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

const result = paginate<IUser>({ data: usersData }).toRest();

// or 

const result = paginate<IUser>({ data: usersData }).toGql();

```

## Change size on nested pages 

If the amount of records to be displayed changes, first request an update of the value, passing only the value and then navigate informing the cursor

```ts

import { Pager } from 'ts-paginate';

const { paginate } = new Pager();

// I am on page 3
const pages = paginate({ data, params: { size: 15, after: 'cursor_20' } });

// I want to change size for 5 items per page
paginate({ data, params:{ size: 5 }});

// Now you navigate for page 3
paginate({ data, params:{ size: 5, after: 'cursor_10' }})

```
