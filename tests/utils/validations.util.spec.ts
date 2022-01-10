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
				cursor: undefined, hasNextPage: false, hasPreviousPage: false, totalCount: 0
			});

		});

		it('should have hasNextPage and hasPreviousPage', () => {
			
			const originalData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
			const dataPayload = [{ id: '2' }, { id: '3' }];

			const result = pager({ data: originalData, params: { after: '2', size: 2 } }).toRest();

			expect(result.pageInfo).toEqual({
				cursor: '4', hasNextPage: true, hasPreviousPage: true, totalCount: 4
			});
			expect(result.data).toEqual(dataPayload);

		});

		it('should have hasNextPage and not hasPreviousPage', () => {
			
			const originalData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
			const dataPayload = [{ id: '1' }, { id: '2' }, { id: '3' }];

			const result = pager({ data: originalData, params: { size: 3 } }).toRest();

			expect(result.pageInfo).toEqual({
				cursor: '4', hasNextPage: true, hasPreviousPage: false, totalCount: 4
			});
			expect(result.data).toEqual(dataPayload);

		});

		it('should have hasPreviousPage and not hasNextPage', () => {
			
			const originalData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
			const dataPayload = [{ id: '3' }, { id: '4' }, { id: '5' }];

			const result = pager({ data: originalData, params: { after: '3', size: 3 } }).toRest();

			expect(result.pageInfo).toEqual({
				cursor: '5', hasNextPage: false, hasPreviousPage: true, totalCount: 4
			});
			expect(result.data).toEqual(dataPayload);


		});
	});

});
