import {
	ExistId,
	GetCursorIndex, GetNextAndPrevPagination, GetNextCursor, GetPreviousCursor, HasAfterAndBeforeCursor, HasAfterCursorParam, HasBeforeCursorParam, HasNextPage, HasPreviousPage, SliceNextData, SlicePreviousData, ValidateProps
} from "../../lib/utils/validations.utils";

describe('validation.util', () => {

	describe('ValidateProps', () => {

		it('should to throw if provide after and before', () => {
			
			const toThrow = () => ValidateProps({
				data: [{ id: 'valid' }], params: { after: 'param', before: 'param' }
			});
			expect(toThrow).toThrowError('Paginator: use after or before as cursor param');

		});

		it('should to throw if any data record does not have id', () => {
			
			const toThrow = () => ValidateProps({
				data: [{ id: 'valid' }, { } as any], params: { }
			});
			expect(toThrow).toThrowError('Paginator: all records on data must have id attribute');

		});

		it('should to throw if provide a negative size', () => {
			
			const toThrow = () => ValidateProps({
				data: [{ id: 'valid' }], params: { size: -1 }
			});
			expect(toThrow).toThrowError('Paginator: size param must be a positive number');

		});

	})
	
	describe('validate id', () => {
		
		it('should do not have id attribute', () => {
			const data = { name: 'some' };
			const result = ExistId(data);

			expect(result).toBeFalsy();
		});

		it('should do not have id attribute', () => {
			const data = { id: undefined };
			const result = ExistId(data);

			expect(result).toBeFalsy();
		});

		it('should have id attribute', () => {
			const data = { id: 'valid_id', name: 'some' };
			const result = ExistId(data);

			expect(result).toBeTruthy();
		});

		it('should have id attribute', () => {
			const data = { id: 1, name: 'some' };
			const result = ExistId(data);

			expect(result).toBeTruthy();
		});

	});

	describe('GetNextAndPrevPagination', () => {

		it('should do not have hasNextPage and hasPreviousPage if provide empty', () => {
			
			const result = GetNextAndPrevPagination({ dataPayload: [], originalData: [] });
			expect(result).toEqual({ hasNextPage: false, hasPreviousPage: false });

		});

		it('should have hasNextPage and hasPreviousPage', () => {
			
			const originalData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
			const dataPayload = [{ id: '2' }, { id: '3' }];

			const result = GetNextAndPrevPagination({ dataPayload, originalData });
			expect(result).toEqual({ hasNextPage: true, hasPreviousPage: true });

		});

		it('should have hasNextPage and not hasPreviousPage', () => {
			
			const originalData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
			const dataPayload = [{ id: '1' }, { id: '2' }, { id: '3' }];

			const result = GetNextAndPrevPagination({ dataPayload, originalData });
			expect(result).toEqual({ hasNextPage: true, hasPreviousPage: false });

		});

		it('should have hasPreviousPage and not hasNextPage', () => {
			
			const originalData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
			const dataPayload = [{ id: '3' }, { id: '4' }, { id: '5' }];

			const result = GetNextAndPrevPagination({ dataPayload, originalData });
			expect(result).toEqual({ hasNextPage: false, hasPreviousPage: true });

		});
	});

	describe('HasAfterCursorParam', () => {

		it('should have after cursor', () => {
			const result = HasAfterCursorParam({ after: 'valid_cursor' });
			expect(result).toBeTruthy();
		});

		it('should dot not have after cursor', () => {
			const result = HasAfterCursorParam({ after: undefined });
			expect(result).toBeFalsy();
		});

	});

	describe('HasBeforeCursorParam', () => {

		it('should have before cursor', () => {
			const result = HasBeforeCursorParam({ before: 'valid_cursor' });
			expect(result).toBeTruthy();
		});

		it('should dot not have before cursor', () => {
			const result = HasBeforeCursorParam({ before: undefined });
			expect(result).toBeFalsy();
		});

	});
	
	describe('HasAfterAndBeforeCursor', () => {

		it('should have before and after cursor', () => {
			const result = HasAfterAndBeforeCursor({ before: 'valid_cursor', after: 'valid_cursor' });
			expect(result).toBeTruthy();
		});

		it('should dot not have before and after cursor', () => {
			const result = HasAfterAndBeforeCursor({ before: undefined, after: 'valid_cursor' });
			expect(result).toBeFalsy();
		});

	});
	
	describe('GetCursorIndex', () => {

		it('should get index 1', () => {

			const result = GetCursorIndex({
				cursor: 'cursor_id2',
				data: [{ id: 'cursor_id1' }, { id: 'cursor_id2' }, { id: 'cursor_id3' },]
			});

			expect(result).toBe(1)
		});

		it('should get index -1', () => {

			const result = GetCursorIndex({
				cursor: 'invalid_cursor_id',
				data: [{ id: 'cursor_id1' }, { id: 'cursor_id2' }, { id: 'cursor_id3' },]
			});

			expect(result).toBe(-1)
		})
	});

	describe('HasNextPage', () => {

		it('should do not have next page empty data', () => {
			
			const hasNextPage = HasNextPage({
				data: [],
				currentCursorIndex: 0,
				size: 3
			});

			expect(hasNextPage).toBeFalsy();
			
		});

		it('should do not have next page index 3 size 3', () => {
			
			const hasNextPage = HasNextPage({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				currentCursorIndex: 3,
				size: 3
			});

			expect(hasNextPage).toBeFalsy();
			
		});

		it('should have next page index 0 size 3', () => {
			
			const hasNextPage = HasNextPage({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				currentCursorIndex: 0,
				size: 3
			});

			expect(hasNextPage).toBeFalsy();
			
		});

		it('should have next page index 0 size 2', () => {
			
			const hasNextPage = HasNextPage({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				currentCursorIndex: 0,
				size: 2
			});

			expect(hasNextPage).toBeTruthy();
			
		});

		it('should have next page index 2 size 1', () => {
			
			const hasNextPage = HasNextPage({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				currentCursorIndex: 2,
				size: 1
			});

			expect(hasNextPage).toBeFalsy();
			
		});

		it('should have next page index 1 size 1', () => {
			
			const hasNextPage = HasNextPage({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				currentCursorIndex: 1,
				size: 1
			});

			expect(hasNextPage).toBeTruthy();
			
		});

	})

	describe('HasPreviousPage', () => {

		it('should do not have previous page index 0 size 1', () => {
			const hasPreviousPage = HasPreviousPage({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				currentCursorIndex: 0,
				size: 1
			});

			expect(hasPreviousPage).toBeFalsy();
		});

		it('should do not have previous page index 1 size 2', () => {
			const hasPreviousPage = HasPreviousPage({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				currentCursorIndex: 1,
				size: 2
			});

			expect(hasPreviousPage).toBeFalsy();
		});

		it('should have previous page index 3 size 2', () => {
			const hasPreviousPage = HasPreviousPage({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				currentCursorIndex: 3,
				size: 2
			});

			expect(hasPreviousPage).toBeTruthy();
		});

		it('should have previous page index 2 size 1', () => {
			const hasPreviousPage = HasPreviousPage({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				currentCursorIndex: 2,
				size: 1
			});

			expect(hasPreviousPage).toBeTruthy();
		});
	});

	describe('GetNextCursor', () => {

		it('should get next cursor: valid_id2', () => {
			const nextCursor = GetNextCursor({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					after: 'valid_id1',
					size: 1
				}
			});

			expect(nextCursor).toBe('valid_id2');
		});

		it('should get next cursor: valid_id4', () => {
			const nextCursor = GetNextCursor({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					after: 'valid_id2',
					size: 2
				}
			});

			expect(nextCursor).toBe('valid_id4');
		});

		it('should get next cursor: valid_id4', () => {
			const nextCursor = GetNextCursor({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					after: 'valid_id2',
					size: 5
				}
			});

			expect(nextCursor).toBe('valid_id4');
		});

		it('should get last position if not provide after and size', () => {
			const nextCursor = GetNextCursor({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {}
			});

			expect(nextCursor).toBe('valid_id4');
		});

	});

	describe('GetPreviousCursor', () => {

		it('should get previous cursor: valid_id2', () => {
			const beforeCursor = GetPreviousCursor({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					before: 'valid_id4',
					size: 1
				}
			});

			expect(beforeCursor).toBe('valid_id2');
		});

		it('should get previous cursor: valid_id1', () => {
			const beforeCursor = GetPreviousCursor({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					before: 'valid_id4',
					size: 2
				}
			});

			expect(beforeCursor).toBe('valid_id1');
		});

		it('should get previous cursor: valid_id1', () => {
			const beforeCursor = GetPreviousCursor({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					before: 'valid_id4',
					size: 5
				}
			});

			expect(beforeCursor).toBe('valid_id1');
		});

		it('should get first position if not provide before and size', () => {
			const beforeCursor = GetPreviousCursor({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {}
			});

			expect(beforeCursor).toBe('valid_id1');
		});

	});

	describe('SlicePreviousData', () => {

		it('should slice 2 items', () => {
			const result = SlicePreviousData({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					before: 'valid_id3',
					size: 2
				}
			});

			expect(result).toEqual([{ id: 'valid_id1' }, { id: 'valid_id2' }]);
		});

		it('should slice 2 items', () => {
			const result = SlicePreviousData({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					before: 'valid_id3',
					size: 5
				}
			});

			expect(result).toEqual([{ id: 'valid_id1' }, { id: 'valid_id2' }]);
		});

		
		it('should slice 1 items', () => {
			const result = SlicePreviousData({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					before: 'valid_id3',
					size: 1
				}
			});

			expect(result).toEqual([{ id: 'valid_id2' }]);
		});

		it('should slice empty', () => {
			const result = SlicePreviousData({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					before: 'valid_id1',
					size: 1
				}
			});

			expect(result).toEqual([]);
		});

	});

	describe('SliceNextData', () => {
		it('should slice empty', () => {
			const result = SliceNextData({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					after: 'valid_id4',
					size: 1
				}
			});

			expect(result).toEqual([]);
		});

		it('should slice all', () => {
			const result = SliceNextData({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					after: 'valid_id1',
					size: 10
				}
			});

			expect(result).toEqual([{ id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }]);
		});

		it('should slice 1 item', () => {
			const result = SliceNextData({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					after: 'valid_id1',
					size: 1
				}
			});

			expect(result).toEqual([{ id: 'valid_id2' }]);
		});

		it('should slice 2 items', () => {
			const result = SliceNextData({
				data: [{ id: 'valid_id1' }, { id: 'valid_id2' }, { id: 'valid_id3' }, { id: 'valid_id4' }],
				params: {
					after: 'valid_id2',
					size: 2
				}
			});

			expect(result).toEqual([{ id: 'valid_id3' }, { id: 'valid_id4' }]);
		});
	});

});
