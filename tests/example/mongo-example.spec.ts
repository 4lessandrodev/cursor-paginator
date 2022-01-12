import { Pager } from '../../lib'
import makeFakeUsers, { IUser } from "../../examples/make-data"
import { IPageInfo } from '../../lib/types/types';

describe('example', () => {

	const pager = new Pager({
		cursorKey: '_id',
		pageSize: 10
	});

	interface IResult {
		original: IUser[];
		payload: IUser[];
		pageInfo: IPageInfo;
	}
	
	const data: IResult = {
		original: [],
		payload: [],
		pageInfo: {
			hasNextPage: false,
			hasPreviousPage: false,
			totalCount: 0,
			firstCursor: undefined,
			lastCursor: undefined
		}
	}

	beforeAll(() => {
		data.original = makeFakeUsers(40);
	});

	it('should return first item data if try to go back', () => {

		const cursor = data.original[0]._id;

		const result = pager.paginate({
			data: data.original,
			params: {
				before: cursor
			}
		}).toRest();

	expect(result.data).toHaveLength(1);
	expect(result.data[0]).toEqual(data.original[0]);
	expect(result.pageInfo.hasPreviousPage).toBeFalsy();
	expect(result.pageInfo.hasNextPage).toBeTruthy();
	
});

	it('should get first 15 items', () => {

		
		const result = pager.paginate({
			data: data.original,
			params: { size: 15 }
		}).toRest();
		
		data.payload = result.data;
		data.pageInfo = result.pageInfo;

		expect(result.data).toHaveLength(15);
		expect(result.pageInfo.hasPreviousPage).toBeFalsy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();

	});

	it('should get next 15 items', () => {

		const nextCursor = data.pageInfo.lastCursor;

		const result = pager.paginate({
			data: data.original,
			params: {
				size: 15,
				after: nextCursor
			}
		}).toRest();
		
		data.payload = result.data;
		data.pageInfo = result.pageInfo;

		expect(result.data).toHaveLength(15);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();

	});

	it('should get last 13 items', () => {

		const nextCursor = data.pageInfo.lastCursor;

		const result = pager.paginate({
			data: data.original,
			params: {
				size: 15,
				after: nextCursor
			}
		}).toRest();

		data.payload = result.data;
		data.pageInfo = result.pageInfo;

		expect(result.data).toHaveLength(13);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeFalsy();

	});

	it('should get empty if it finished', () => {

		try {
			
			const nextCursor = data.pageInfo.lastCursor;
	
			pager.paginate({
				data: data.original,
				params: {
					size: 15,
					after: nextCursor
				}
			}).toRest();

		} catch (error: any) {
			expect(error.message).toBe('there is not data after cursor: 41')
		}


	});

	it('should get back previous 16 items', () => {

		const nextCursor = data.pageInfo.firstCursor;

		const result = pager.paginate({
			data: data.original,
			params: {
				size: 15,
				before: nextCursor
			}
		}).toRest();

		data.payload = result.data;
		data.pageInfo = result.pageInfo;

		expect(result.data).toHaveLength(15);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();

	});

	it('should get back previous 16 items as graphQL data', () => {

		const result = pager.paginate({
			data: data.original,
			params: {
				size: 10,
				after: data.original[0]._id
			}
		}).toGql();

		expect(result.data[0].node).toEqual(data.original[0]);
		expect(result.data[0].cursor).toEqual(data.original[0]._id);
		expect(result.data).toHaveLength(10);
		expect(result.pageInfo.hasPreviousPage).toBeFalsy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();

	});
	
});
