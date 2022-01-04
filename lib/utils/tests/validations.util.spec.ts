import { GetCursorIndex, HasAfterAndBeforeCursor, HasAfterCursorParam, HasBeforeCursorParam } from "../validations.utils";

describe('validation.util', () => {
	
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

	describe('HasNextPage', () => {})
	describe('HasPreviousPage', () => {})
	describe('GetNextCursor', () => {})
	describe('GetPreviousCursor', () => {})
	describe('SlicePreviousData', () => {})
	describe('SliceNextData', () => {})

})