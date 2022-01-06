import {
	GetCursorIndex, GetNextCursor, GetPreviousCursor, HasAfterAndBeforeCursor, HasAfterCursorParam, HasBeforeCursorParam, HasNextPage, HasPreviousPage, IsValidSize, SliceNextData, SlicePreviousData
} from "../utils/validations.utils";
import { IDefaultProps, IPaginator, IPaginatorParams, IPaginatorResult } from "../../types";

export const defaultPerPageSize = 25;

export const Paginator: IPaginator = <T extends IDefaultProps>(props: IPaginatorParams<T>): IPaginatorResult<T> => {

	const size = props.params.size ?? defaultPerPageSize;
	const hasAfterAndBeforeCursor = HasAfterAndBeforeCursor(props.params);
	const originalData = props.data;
	const dataLength = props.data.length - 1;

	let dataPayload: T[] = [];
	let currentCursor = undefined;
	let nextCursor = undefined;
	let previousCursor = undefined;
	let currentIndex = 0;
	let hasNextPage = false;
	let hasPreviousPage = false;

	if (hasAfterAndBeforeCursor) {
		throw new Error("use after or before as cursor param");
	}

	const isValidSize = IsValidSize(size);

	if (!isValidSize) {
		throw new Error("size param must be a positive number");
	}

	const isAfter = HasAfterCursorParam(props.params);
	// CALLS AFTER LOGIC 
	if (isAfter) {
		currentCursor = props.params.after;
		currentIndex = GetCursorIndex<T>({ cursor: String(props.params.after), data: originalData });
		dataPayload = SliceNextData<T>({ data: originalData, params: props.params });
		nextCursor = GetNextCursor({ data: originalData, params: { after: currentCursor, size: size }});
		previousCursor = GetPreviousCursor({ data: originalData, params: { before: currentCursor, size: size } });
	}
	
	const isBefore = HasBeforeCursorParam(props.params);
	// CALLS BEFORE LOGIC
	if (isBefore) {
		currentCursor = props.params.before;
		currentIndex = GetCursorIndex<T>({ cursor: String(props.params.before), data: originalData });
		dataPayload = SlicePreviousData<T>({ data: originalData, params: props.params });
		nextCursor = GetNextCursor({ data: originalData, params: { after: currentCursor, size: size }});
		previousCursor = GetPreviousCursor({ data: originalData, params: { before: currentCursor, size: size } });
	}
	
	// CALLS DEFAULT LOGIC
	if (!isBefore && !isAfter) {
		dataPayload = SlicePreviousData<T>({ data: originalData, params: props.params });
		nextCursor = GetNextCursor({ data: originalData, params: { after: currentCursor, size: size }});
		previousCursor = GetPreviousCursor({ data: originalData, params: { before: currentCursor, size: size } });
	}
	
	hasNextPage = HasNextPage({ currentCursorIndex: currentIndex, data: originalData, size: size });
	hasPreviousPage = HasPreviousPage({ currentCursorIndex: currentIndex, data: originalData, size: size });

	// CHECK DIRECTION
	if (!hasPreviousPage && isAfter && typeof previousCursor !== 'undefined' && typeof currentCursor !== 'undefined') {
		hasPreviousPage = true;
	}

	// CHECK DIRECTION
	if (!hasNextPage && isBefore && typeof nextCursor !== 'undefined' && typeof currentCursor !== 'undefined') {
		hasNextPage = true;
	}

	// EXECUTE DEFAULT PROPS
	return {
		data: dataPayload,
		pageInfo: {
			hasNextPage: hasNextPage,
			hasPreviousPage: hasPreviousPage,
			totalCount: dataLength,
			currentCursor: currentCursor,
			nextCursor: nextCursor,
			previousCursor: previousCursor
		}
	}
}

export default Paginator;
