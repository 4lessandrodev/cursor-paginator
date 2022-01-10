import { Pager } from '../../lib'
import makeFakeUsers, { IUser } from "../../examples/make-data"

describe('example', () => {

	const pager = new Pager({
		cursorKey: '__cursor',
		pageSize: 10
	});

	interface IResult {
		original: IUser[];
		payload: IUser[];
		pageInfo: any;
	}
	
	const data: IResult = {
		original: [],
		payload: [],
		pageInfo: {
			hasNextPage: false,
			hasPreviousPage: false,
			totalCount: 0,
			cursor: undefined
		}
	}

	beforeAll(() => {
		data.original = makeFakeUsers(40);
	});

	it('should return empty data if try to go back', () => {
		expect.assertions(1);
		try {
			
			const cursor = data.original[0].__cursor;

			pager.paginate({
				data: data.original,
				params: {
					before: cursor
				}
			}).toRest<IUser>();

		} catch (error: any) {
			expect(error.message).toBe('there is not data before cursor: 1')
		}


	});

	it('should get first 15 items', () => {

		
		const result = pager.paginate({
			data: data.original,
			params: { size: 15 }
		}).toRest<IUser>();
		
		data.payload = result.data;
		data.pageInfo = result.pageInfo;

		expect(result.data).toHaveLength(15);
		expect(result.pageInfo.hasPreviousPage).toBeFalsy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();

	});

	it('should get next 15 items', () => {

		const nextCursor = data.pageInfo.cursor;

		const result = pager.paginate({
			data: data.original,
			params: {
				size: 15,
				after: nextCursor
			}
		}).toRest<IUser>();
		
		data.payload = result.data;
		data.pageInfo = result.pageInfo;

		expect(result.data).toHaveLength(15);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();

	});

	it('should get last 11 items', () => {

		const nextCursor = data.pageInfo.cursor;

		const result = pager.paginate({
			data: data.original,
			params: {
				size: 15,
				after: nextCursor
			}
		}).toRest<IUser>();

		data.payload = result.data;
		data.pageInfo = result.pageInfo;

		expect(result.data).toHaveLength(11);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeFalsy();

	});

	it('should get empty if it finished', () => {

		try {
			
			const nextCursor = data.pageInfo.cursor;
	
			pager.paginate({
				data: data.original,
				params: {
					size: 15,
					after: nextCursor
				}
			}).toRest<IUser>();

		} catch (error: any) {
			expect(error.message).toBe('there is not data after cursor: 41')
		}


	});

	it('should get back previous 16 items', () => {

		const nextCursor = data.pageInfo.cursor;

		const result = pager.paginate({
			data: data.original,
			params: {
				size: 15,
				before: nextCursor
			}
		}).toRest<IUser>();

		data.payload = result.data;
		data.pageInfo = result.pageInfo;

		expect(result.data).toHaveLength(15);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeFalsy();

	});

	it('should get back previous 16 items as graphQL data', () => {

		const result = pager.paginate({
			data: data.original,
			params: {
				size: 10,
				after: data.original[0].__cursor
			}
		}).toGql<IUser>();

		expect(result.data[0].node).toEqual(data.original[0]);
		expect(result.data[0].cursor).toEqual(data.original[0].__cursor);
		expect(result.data).toHaveLength(10);
		expect(result.pageInfo.hasPreviousPage).toBeFalsy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();

	});
	
});
