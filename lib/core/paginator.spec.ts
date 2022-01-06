import Paginator from "./paginator";

describe('paginator.ts', () => {
	
	interface IFake {
		id: string;
	};

	const fakeData: IFake[] = [];

	for (let index = 1; index < 42; index++) {
		fakeData.push({ id: String(index) });
	}

	it('should paginate 7 items after position 15º', () => {
		const result = Paginator({
			data: fakeData,
			params: {
				size: 7,
				after: '15'
			}
		});

		expect(result.pageInfo).toEqual({
			hasNextPage: true,
			hasPreviousPage: true,
			totalCount: 40,
			currentCursor: '15',
			nextCursor: '22',
			previousCursor: '7'
		})
		expect(result.data).toHaveLength(7);
		expect(result.data[0].id).toBe('16');
		expect(result.data[6].id).toBe('22');
	});

	it('should paginate 3 items after position 1º', () => {
		const result = Paginator({
			data: fakeData,
			params: {
				size: 3,
				after: '1'
			}
		});

		expect(result.pageInfo).toEqual({
			hasNextPage: true,
			hasPreviousPage: true,
			totalCount: 40,
			currentCursor: '1',
			nextCursor: '4',
			previousCursor: '1'
		})
		expect(result.data).toHaveLength(3);
		expect(result.data[0].id).toBe('2');
		expect(result.data[2].id).toBe('4');
	});

	it('should paginate 3 items 1-3', () => {
		const result = Paginator({
			data: fakeData,
			params: {
				size: 3
			}
		});

		expect(result.pageInfo).toEqual({
			hasNextPage: true,
			hasPreviousPage: false,
			totalCount: 40,
			currentCursor: undefined,
			nextCursor: '4',
			previousCursor: '1'
		})
		expect(result.data).toHaveLength(3);
		expect(result.data[0].id).toBe('1');
		expect(result.data[2].id).toBe('3');
	});

	it('should do not have next page', () => {
		const result = Paginator({
			data: fakeData,
			params: {
				size: 7,
				after: '35'
			}
		});

		expect(result.pageInfo).toEqual({
			hasNextPage: false,
			hasPreviousPage: true,
			totalCount: 40,
			currentCursor: '35',
			nextCursor: '1',
			previousCursor: '27'
		});
	});

	it('should throws if provide before and after', () => {
		expect.assertions(1);

		try {
			Paginator({ data: fakeData, params: { after: 'valid', before: 'valid' } });
		} catch (error: any) {
			expect(error.message).toBe('use after or before as cursor param');
		}
	});

	it('should throws if provide negative value as size', () => {
		expect.assertions(1);

		try {
			Paginator({ data: fakeData, params: { size: -2 } });
		} catch (error: any) {
			expect(error.message).toBe('size param must be a positive number');
		}
	});
	
});
