import { paginate } from "../../dist";
import { IPageInfo } from "../../dist/types/types";
import makeFakeUsers, { IUser } from "../../examples/make-data"

describe('example', () => {
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
			currentCursor: undefined,
			nextCursor: undefined,
			previousCursor: undefined
		}
	}

	beforeAll(() => {
		data.original = makeFakeUsers(40);
	});

	it('should return empty data if try to go back', () => {
		
		const cursor = data.original[0].id;

		const result = paginate({
			data: data.original,
			params: {
				before: cursor
			}
		});

		data.payload = result.data;
		data.pageInfo = result.pageInfo;
		console.log(data.pageInfo);
		console.log(data.payload);

		expect(result.data).toHaveLength(0);
		expect(result.pageInfo.hasPreviousPage).toBeFalsy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();
		expect(result.pageInfo.currentCursor).toBe(cursor);
		expect(result.pageInfo.previousCursor).toBe(cursor);

	});

	it('should get first 15 items', () => {

		
		const result = paginate({
			data: data.original,
			params: { size: 15 }
		});
		
		data.payload = result.data;
		data.pageInfo = result.pageInfo;
		console.log(data.pageInfo);
		console.log(data.payload);

		expect(result.data).toHaveLength(15);
		expect(result.pageInfo.hasPreviousPage).toBeFalsy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();

	});

	it('should get next 15 items', () => {

		const nextCursor = data.pageInfo.nextCursor;

		const result = paginate({
			data: data.original,
			params: {
				size: 15,
				after: nextCursor
			}
		});
		
		data.payload = result.data;
		data.pageInfo = result.pageInfo;
		console.log(data.pageInfo);
		console.log(data.payload);

		expect(result.data).toHaveLength(15);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();

	});

	it('should get last 10 items', () => {

		const nextCursor = data.pageInfo.nextCursor;

		const result = paginate({
			data: data.original,
			params: {
				size: 15,
				after: nextCursor
			}
		});
		
		data.payload = result.data;
		data.pageInfo = result.pageInfo;
		console.log(data.pageInfo);
		console.log(data.payload);

		expect(result.data).toHaveLength(10);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeFalsy();
	});

	it('should get empty data if does not exists data after cursor', () => {

		const nextCursor = data.pageInfo.nextCursor;

		const result = paginate({
			data: data.original,
			params: {
				size: 15,
				after: nextCursor
			}
		});
		
		data.payload = result.data;
		data.pageInfo = result.pageInfo;
		console.log(data.pageInfo);
		console.log(data.payload);

		expect(result.data).toHaveLength(0);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeFalsy();
	});

	it('should get back previous 15 items', () => {

		const nextCursor = data.pageInfo.nextCursor;

		const result = paginate({
			data: data.original,
			params: {
				size: 15,
				before: nextCursor
			}
		});
		
		data.payload = result.data;
		data.pageInfo = result.pageInfo;
		console.log(data.pageInfo);
		console.log(data.payload);

		expect(result.data).toHaveLength(15);
		expect(result.pageInfo.hasPreviousPage).toBeTruthy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();
	});
	
})