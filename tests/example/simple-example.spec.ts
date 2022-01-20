import { Pager } from '../../lib'
import makeFakeUsers, { IUser } from "../../examples/make-data"
import { IPageInfo } from '../../lib/types/types';

describe('example', () => {

	const pager = new Pager();

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
			currentItem: 0,
			sizePerPage: 0,
			page: {
				current: 0,
				of: 0,
			},
			firstCursor: undefined,
			lastCursor: undefined
		}
	}

	beforeAll(() => {
		data.original = makeFakeUsers(40);
	});

	it('should throw error if try back and no exist previous page', () => {

			const cursor = data.original[0].id;

		expect.assertions(1);

		try {

			pager.paginate({
				data: data.original,
				params: {
					before: cursor
				}
			}).toRest();
			
		} catch (error: any) {
			expect(error.message).toBe('there is not data before cursor: 1')
		}

		
	});

	it('should get first 10 items if provide a size greater available', () => {

		const result = pager.paginate({
			data: data.original,
			params: {
				size: 20,
				before: data.original[10].id
			}
		}).toGql();

		const firstCursor = result.data[0].cursor;

		expect(result.data).toHaveLength(10);
		expect(result.pageInfo.hasPreviousPage).toBeFalsy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();
		expect(firstCursor).toBe(data.original[0].id);

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

	it('should get last 11 items', () => {

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

		expect(result.data).toHaveLength(11);
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

		const nextCursor = data.pageInfo.lastCursor;

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
				after: data.original[0].id
			}
		}).toGql();

		expect(result.data[0].node).toEqual(data.original[1]);
		expect(result.data[0].cursor).toEqual(data.original[1].id);
		expect(result.data).toHaveLength(10);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();

	});

	it('should get last 10 items if provide a size greater available', () => {

		const result = pager.paginate({
			data: data.original,
			params: {
				size: 20,
				after: data.original[30].id
			}
		}).toGql();

		const lastCursor = result.data[result.data.length - 1].cursor;

		expect(result.data).toHaveLength(10);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeFalsy();
		expect(lastCursor).toBe(data.original[data.original.length -1].id);

	});

	it('should return all data if provide total size', () => {

		const result = pager.paginate({
			data: data.original,
			params: {
				size: data.original.length
			}
		}).toRest();

		const hasPreviousPage = result.pageInfo.hasPreviousPage;
		const hasNextPage = result.pageInfo.hasNextPage;
		const firstCursor = result.pageInfo.firstCursor;
		const lastCursor = result.pageInfo.lastCursor;

		expect(result.data).toHaveLength(41);
		expect(hasPreviousPage).toBeFalsy();
		expect(hasNextPage).toBeFalsy();
		expect(firstCursor).toBe('1');
		expect(lastCursor).toBe('41');

	});
	
});
