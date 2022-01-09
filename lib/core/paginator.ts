import {
	defaultPerPageSize,
	GetNextAndPrevPagination,
	GetNextCursor, GetPreviousCursor,
	HasAfterCursorParam,
	HasBeforeCursorParam,
	SliceNextData, SlicePreviousData, ValidateProps,
} from "../utils/validations.utils";
import {
	IDefaultProps, IHasNextAndPrev, IPaginator,
	IPaginatorParams, IPaginatorResult
} from "../types/types";


/**
 * @description this function receives a vector of records and slice it following provided criterial
 * @param props as object
 * @summary on props `data` is a vector of records coming from the database or any service.
 * @summary on props `params` is the criterial settings
 * @requires id attribute on each data item.
 * 
 * @param props Object
 * @param props.data Array of Objects. Oject must have id attribute.
 * @param props.params Object
 * @param props.params.after String optional as item id value.
 * @param props.params.before String optional as item id value.
 * @param props.params.size Number optional.
 * 
 * @default props.params.size 25
 * 
 * @example 
 * const result = Paginator({
 *		data: Records,
 *		params: {
 *			size: 7,
 *			after: 'record_id'
 *		}
 *	});
 * 
 * @returns
 * @param data as partial array of provided records.
 * @param pageInfo as Object as pagination details.
 * @param pageInfo.hasNextPage as Boolean.
 * @param pageInfo.hasPreviousPage as Boolean.
 * @param pageInfo.totalCount as Number.
 * @param pageInfo.currentCursor as String.
 * @param pageInfo.nextCursor as String.
 * @param pageInfo.previousCursor as String.
 * 
 * @example
 * {
 *		data,
 *		pageInfo: {
 *			hasNextPage,
 *			hasPreviousPage,
 *			totalCount,
 *			currentCursor,
 *			nextCursor,
 *			previousCursor
 *		}
 *	}
 * 
 */
export const paginate: IPaginator = <T extends IDefaultProps>(props: IPaginatorParams<T>): IPaginatorResult<T> => {

	const size = props.params.size ?? defaultPerPageSize;
	const originalData = props.data;
	const dataLength = props.data.length - 1;
	const firstLimitCursor = props.data[0]?.id;
	const lastLimitCursor = props.data[dataLength]?.id;
	const pagination: IHasNextAndPrev = {
		hasPreviousPage: false,
		hasNextPage: false
	};

	let dataPayload: T[] = [];
	let currentCursor: string | undefined = undefined;
	let nextCursor: string | undefined = undefined;
	let previousCursor: string | undefined = undefined;

	// VALIDATE ALL PROPS
	ValidateProps(props);

	const isAfter = HasAfterCursorParam(props.params);
	// CALLS AFTER LOGIC 
	if (isAfter) {
		currentCursor = props.params.after;
		// COULD NOT GOES AFTER LIMIT 
		if (currentCursor !== lastLimitCursor) {
			dataPayload = SliceNextData<T>({ data: originalData, params: props.params });
			nextCursor = GetNextCursor({ data: originalData, params: { after: currentCursor, size: size }});
		} else {
			// IF AFTER LIMIT RETURNS AN EMPTY RESULT
			dataPayload = [];
			nextCursor = props.params.after;
		}
		previousCursor = GetPreviousCursor({ data: originalData, params: { before: currentCursor, size: size } });
	}
	
	const isBefore = HasBeforeCursorParam(props.params);
	// CALLS BEFORE LOGIC
	if (isBefore) {
		// COULD NOT GOES BEFORE START LIMIT
		currentCursor = props.params.before;
		if (currentCursor !== firstLimitCursor) {
			dataPayload = SlicePreviousData<T>({ data: originalData, params: props.params });
			previousCursor = GetPreviousCursor({ data: originalData, params: { before: currentCursor, size: size } });
		} else {
			// IF BEFORE START RETURNS AN EMPTY RESULT
			dataPayload = [];
			previousCursor = props.params.before;
		}
		nextCursor = GetNextCursor({ data: originalData, params: { after: currentCursor, size: size }});
	}
	
	// CALLS DEFAULT LOGIC
	if (!isBefore && !isAfter) {
		currentCursor = originalData[0]?.id;
		dataPayload = SlicePreviousData<T>({ data: originalData, params: props.params });
		nextCursor = GetNextCursor({ data: originalData, params: { after: currentCursor, size: size }});
		previousCursor = GetPreviousCursor({ data: originalData, params: { before: currentCursor, size: size } });
	}
	
	// VALIDATE IF IS EMPTY DATA
	if (dataPayload.length > 0) {
		const result = GetNextAndPrevPagination({ dataPayload, originalData })
		pagination.hasNextPage = result.hasNextPage;
		pagination.hasPreviousPage = result.hasPreviousPage;
	} else {
		// IF IS EMPTY DATA GET LOCATION FROM ORIGINAL DATA
		const originalCursorIndex = originalData.findIndex((data) => data?.id === currentCursor);
		if (originalCursorIndex > 0 && dataLength > 0) {
			pagination.hasNextPage = false;
			pagination.hasPreviousPage = true;
		} else if (originalCursorIndex < dataLength && dataLength > 0) {
			pagination.hasNextPage = true;
			pagination.hasPreviousPage = false;
		} else {
			pagination.hasNextPage = false;
			pagination.hasPreviousPage = false;
		}
	}

	// RETURN RESULT
	return {
		data: dataPayload,
		pageInfo: {
			hasNextPage: pagination.hasNextPage,
			hasPreviousPage: pagination.hasPreviousPage,
			totalCount: dataLength,
			currentCursor: currentCursor,
			nextCursor: nextCursor,
			previousCursor: previousCursor
		}
	}
}

export default paginate;
