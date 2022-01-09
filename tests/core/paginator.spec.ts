import { paginate } from "../../lib";

describe('paginate.ts', () => {
	
	interface IFake {
		id: string;
	};

	const fakeData: IFake[] = [];

	for (let index = 1; index < 42; index++) {
		fakeData.push({ id: String(index) });
	}

	it('should paginate 7 items after position 15º', () => {
		const result = paginate({
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

	it('should paginate 7 items before position 30º', () => {
		const result = paginate({
			data: fakeData,
			params: {
				size: 7,
				after: '30'
			}
		});

		expect(result.pageInfo).toEqual({
			hasNextPage: true,
			hasPreviousPage: true,
			totalCount: 40,
			currentCursor: '30',
			nextCursor: '37',
			previousCursor: '22'
		})
		expect(result.data).toHaveLength(7);
		expect(result.data[0].id).toBe('31');
		expect(result.data[6].id).toBe('37');
	});

	it('should paginate 3 items after position 1º', () => {
		const result = paginate({
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
		const result = paginate({
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
		const result = paginate({
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


	it('should paginate to before', () => {
		const result = paginate({
			data: fakeData,
			params: {
				size: 3,
				before: '35'
			}
		});

		expect(result.data).toEqual([{ id: '32' }, { id: '33' }, { id: '34' } ])

		expect(result.pageInfo).toEqual({
			hasNextPage: true,
			hasPreviousPage: true,
			totalCount: 40,
			currentCursor: '35',
			nextCursor: '38',
			previousCursor: '31'
		});
	});

	it('should throws if provide before and after', () => {
		expect.assertions(1);

		try {
			paginate({ data: fakeData, params: { after: 'valid', before: 'valid' } });
		} catch (error: any) {
			expect(error.message).toBe('paginate: use after or before as cursor param');
		}
	});

	it('should throws if provide negative value as size', () => {
		expect.assertions(1);

		try {
			paginate({ data: fakeData, params: { size: -2 } });
		} catch (error: any) {
			expect(error.message).toBe('paginate: size param must be a positive number');
		}
	});

	it('should get start array if provide an invalid id', () => {

		const result = paginate({ data: fakeData, params: { size: 3, after: 'invalid_id' } });
		expect(result.data).toHaveLength(3);
		expect(result.pageInfo.hasPreviousPage).toBeFalsy();
		expect(result.pageInfo.hasNextPage).toBeTruthy();
		expect(result.data).toEqual([{ id: '1' }, { id: '2' }, { id: '3' }]);

	});

	it('should throws if some attribute on data does not have id attribute', () => {
		expect.assertions(1);

		try {
			
			fakeData[5] = { name: 'some name' } as any;
			paginate({ data: fakeData, params: { size: 3 } });

		} catch (error: any) {
			expect(error.message).toBe('paginate: all records on data must have id attribute');
		}
	});
	
});
