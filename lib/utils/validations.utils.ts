import {
	IGetCursorIndex,
	IHasAfterAndBeforeCursor,
	IHasAfterCursor,
	IHasBeforeCursor,
	IHasPaginateSize,
	IParams,
	IGetCursorIndexParams,
	IHasNextPage,
	IHasNestCursor,
	IHasPreviousPage,
	IGetNextCursor,
	IPaginatorParams,
	IGetPreviousCursor,
	ISlicePreviousData,
	ISliceNextData,
	IDefaultProps
} from "../../types";
import { defaultPerPageSize } from "../core/paginator";



export const HasAfterCursorParam: IHasAfterCursor = (params: IParams): boolean => params.after !== undefined;

export const HasBeforeCursorParam: IHasBeforeCursor = (params: IParams): boolean => params.before !== undefined;

export const HasPaginateSizeParam: IHasPaginateSize = (params: IParams): boolean => params.size !== undefined;

export const HasAfterAndBeforeCursor: IHasAfterAndBeforeCursor = (params: IParams): boolean => {
	return HasAfterCursorParam(params) && HasBeforeCursorParam(params);
};

export const GetCursorIndex: IGetCursorIndex = <T extends IDefaultProps>(params: IGetCursorIndexParams<T>) => {
	return params.data.findIndex((item) => item?.['id'] === params.cursor);
}

export const HasNextPage: IHasNextPage = <T>(params: IHasNestCursor<T>): boolean => {
	const isValidIndex = params.currentCursorIndex >= 0;
	const existNext = params.currentCursorIndex < params.data.length;

	return isValidIndex && existNext;
}

export const HasPreviousPage: IHasPreviousPage = <T>(params: IHasNestCursor<T>): boolean => {
	const isValidIndex = params.currentCursorIndex > 0;
	const existNext = params.currentCursorIndex <= params.data.length;

	return isValidIndex && existNext;
}

export const GetNextCursor: IGetNextCursor = <T extends IDefaultProps>(
	props: IPaginatorParams<T>
): string | undefined => {

	const size = props.params?.size ?? defaultPerPageSize;
	const dataLength = props.data.length;

	const nextCursor = size > dataLength ? props.data[dataLength]?.id : props.data[size]?.id;

	return nextCursor;
}

export const GetPreviousCursor: IGetPreviousCursor = <T extends IDefaultProps>(
	props: IPaginatorParams<T>
): string | undefined => {

	const size = props.params?.size ?? defaultPerPageSize;
	const dataLength = props.data.length;
	const position = dataLength - size;

	const previousCursor = position < 0 ? props.data[0]?.id : props.data[position]?.id;

	return previousCursor;
}

export const SlicePreviousData: ISlicePreviousData = <T extends IDefaultProps>(props: IPaginatorParams<T>): T[] => {
	const data = props.data;
	const cursor = props.params.before;
	const size = props.params.size ? props.params.size : defaultPerPageSize;

	if (!cursor) {
		// if not provide a cursor always return array start
		return data.slice(0, size);
	}

	const index = GetCursorIndex({ cursor, data });

	const currentCursorIndex = index === -1 ? 0 : index;

	const hasPreviousPage = HasPreviousPage({ currentCursorIndex, data, size });

	if (hasPreviousPage) {
		return data.reverse().slice(currentCursorIndex, size);
	}

	return data.reverse().slice(0, size);

}

export const SliceNextData: ISliceNextData = <T extends IDefaultProps>(props: IPaginatorParams<T>): T[] => {
	const data = props.data;
	const cursor = props.params.after
	const size = props.params.size ? props.params.size : defaultPerPageSize;

	if (!cursor) {
		// if not provide a cursor always return array end
		return data.reverse().slice(0, size);
	}

	const index = GetCursorIndex({ cursor, data });

	const currentCursorIndex = index === -1 ? data.length : index;

	const hasPreviousPage = HasNextPage({ currentCursorIndex, data, size });

	if (hasPreviousPage) {
		return data.slice(currentCursorIndex, size);
	}

	return data.slice(0, size);

}
