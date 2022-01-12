import { Pager } from "../../lib";

describe('validation.util', () => {

	const pager = new Pager().paginate;

	describe('ValidateProps', () => {

		it('should to throw if provide after and before', () => {
			
			
			const params = { data: [{ id: 'valid' }], params: { after: 'param', before: 'param' } };

			const toThrow = () => pager(params).toRest();
		
			expect(toThrow).toThrowError('paginate: use after or before as cursor param');

		});

		it('should to throw if any data record does not have id', () => {
			
			const params = { data: [{}], params: { after: 'param' } };

			const toThrow = () => pager(params).toRest();

			expect(toThrow).toThrowError('paginate: all records on data must have id attribute');

		});

		it('should to throw if any data record does not have id', () => {
			
			const customPaginate = new Pager({ cursorKey: '__cursor', pageSize: 5 }).paginate;
			const params = { data: [{}], params: { after: 'param' } };

			const toThrow = () => customPaginate(params).toRest();

			expect(toThrow).toThrowError('paginate: all records on data must have __cursor attribute');

		});

		it('should to throw if provide a negative size', () => {
			
			const params = { data: [{ id: 'param' }, { id: 'param2' }], params: { after: 'param', size: -1 } };

			const toThrow = () => pager(params).toRest();

			expect(toThrow).toThrowError('paginate: size param must be a positive number');

		});

	});

	describe('GetNextAndPrevPagination', () => {

		it('should do not have hasNextPage and hasPreviousPage if provide empty', () => {
			
			const result = pager({ data: [] }).toRest();

			expect(result.pageInfo).toEqual({
				currentItem: 0,
				firstCursor: undefined,
				lastCursor: undefined,
				hasNextPage: false,
				hasPreviousPage: false,
				page: {
					current: 0,
					of: 0
				},
				sizePerPage: 0,
				totalCount: 0
			});

		});

		it('should have hasNextPage and hasPreviousPage', () => {
			
			const originalData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
			const dataPayload = [{ id: '3' }, { id: '4' }];

			const result = pager({ data: originalData, params: { after: '2', size: 2 } }).toRest();

			expect(result.pageInfo).toEqual({
				currentItem: 3,
				firstCursor: '3',
				lastCursor: '4',
				hasNextPage: true,
				hasPreviousPage: true,
				page: {
					current: 2,
					of: 3
				},
				sizePerPage: 2,
				totalCount: 5
			});
			expect(result.data).toEqual(dataPayload);

		});

		it('should have hasNextPage and not hasPreviousPage', () => {
			
			const originalData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
			const dataPayload = [{ id: '1' }, { id: '2' }, { id: '3' }];

			const result = pager({ data: originalData, params: { size: 3 } }).toRest();

			expect(result.pageInfo).toEqual({
				currentItem: 1,
				lastCursor: '3',
				firstCursor: '1',
				hasNextPage: true,
				hasPreviousPage: false,
				page: {
					current: 1,
					of: 2
				},
				sizePerPage: 3,
				totalCount: 5
			});
			expect(result.data).toEqual(dataPayload);

		});

		it('should have hasPreviousPage and not hasNextPage', () => {
			
			const originalData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
			const dataPayload = [{ id: '4' }, { id: '5' }];

			const result = pager({ data: originalData, params: { after: '3', size: 3 } }).toRest();

			expect(result.pageInfo).toEqual({
				currentItem: 4,
				lastCursor: '5',
				firstCursor: '4',
				hasNextPage: false,
				hasPreviousPage: true,
				page: {
					current: 2,
					of: 2
				},
				sizePerPage: 3,
				totalCount: 5
			});
			expect(result.data).toEqual(dataPayload);


		});
	});

});
