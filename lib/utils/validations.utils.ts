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
	IDefaultProps,
	IValidateSize,
	IExistId,
	IGetNextAndPrevPagination,
	IHasNextAndPrev,
	IGetRangeParams,
	IValidateProps
} from "../types/types";
import CustomError from "./error";

export const defaultPerPageSize = 25;



export const HasAfterCursorParam: IHasAfterCursor = (params: IParams): boolean => params.after !== undefined;

export const HasBeforeCursorParam: IHasBeforeCursor = (params: IParams): boolean => params.before !== undefined;

export const HasPaginateSizeParam: IHasPaginateSize = (params: IParams): boolean => params.size !== undefined;

export const HasAfterAndBeforeCursor: IHasAfterAndBeforeCursor = (params: IParams): boolean => {
	return HasAfterCursorParam(params) && HasBeforeCursorParam(params);
};

export const GetCursorIndex: IGetCursorIndex = <T extends IDefaultProps>(params: IGetCursorIndexParams<T>) => {
	return params.data.findIndex((item) => item?.['id'] === params.cursor);
}

export const IsValidSize: IValidateSize = (size: number): boolean => (typeof size === "number" && size >= 0);

export const ExistId: IExistId = <T>(record: T): boolean => typeof record?.['id'] !== 'undefined';

export const HasNextPage: IHasNextPage = <T>(params: IHasNestCursor<T>): boolean => {
	const dataLength = params.data.length - 1;
	const currentIndex = params.currentCursorIndex;
	const size = params.size;

	const isValidIndex = currentIndex >= 0 && currentIndex <= dataLength;
	const total = (currentIndex + size);
	const existNext = dataLength > total;

	return isValidIndex && existNext;
}

export const HasPreviousPage: IHasPreviousPage = <T>(params: IHasNestCursor<T>): boolean => {
	const dataLength = params.data.length - 1;
	const currentIndex = params.currentCursorIndex;
	const size = params.size;
	
	const isValidIndex = currentIndex >= 0 && currentIndex <= dataLength;
	const total = (currentIndex - size);
	const existPrevious = total >= 0;

	return isValidIndex && existPrevious;
}

export const GetNextCursor: IGetNextCursor = <T extends IDefaultProps>(
	props: IPaginatorParams<T>
): string | undefined => {

	let nextPosition = 0;

	const size = props.params?.size ?? defaultPerPageSize;
	const dataLength = props.data.length - 1;
	const cursorLimit = dataLength - size;

	let currentCursor = GetCursorIndex({
		cursor: props.params.after ?? props.data[0]?.id ?? '',
		data: props.data
	});

	if (currentCursor === -1){
		currentCursor = 0;
	}

	if (currentCursor >= 0 && currentCursor <= cursorLimit) {
		nextPosition = size + currentCursor;
	}

	const nextCursor = size > dataLength ? props.data[dataLength]?.id : props.data[nextPosition]?.id;

	return nextCursor;
}

export const GetPreviousCursor: IGetPreviousCursor = <T extends IDefaultProps>(
	props: IPaginatorParams<T>
): string | undefined => {

	
	const size = props.params?.size ?? defaultPerPageSize;
	const dataLength = props.data.length - 1;

	let previousPosition = dataLength;

	let currentCursor = GetCursorIndex({
		cursor: props.params.before ?? props.data[0]?.id ?? '',
		data: props.data
	});
	if (currentCursor === -1){
		currentCursor = dataLength;
	}
	
	if (currentCursor >= 0 && currentCursor <= dataLength) {
		previousPosition = (currentCursor - size) - 1;
	}

	const previousCursor = (size <= 0 || previousPosition < 0) ? props.data[0]?.id : props.data[previousPosition]?.id;

	return previousCursor;
}

export const GetNextAndPrevPagination: IGetNextAndPrevPagination = <T extends IDefaultProps>(
	{ originalData, dataPayload }: IGetRangeParams<T>
): IHasNextAndPrev => {

	const dataLength = originalData.length - 1;

	const firstIndex = originalData.findIndex((item) => item.id === dataPayload[0].id);
	const latIndex = originalData.findIndex((item) => item.id === dataPayload[dataPayload.length - 1].id);

	const hasPreviousPage = firstIndex > 0;
	const hasNextPage = latIndex < dataLength;

	return { hasNextPage, hasPreviousPage }
}

export const SlicePreviousData: ISlicePreviousData = <T extends IDefaultProps>(props: IPaginatorParams<T>): T[] => {
	const data = props.data;
	const cursor = props.params.before ?? '';
	const size = props.params.size ? props.params.size : defaultPerPageSize;

	if (!cursor) {
		// if not provide a cursor always return array start part
		return data.slice(0, size);
	}

	const index = GetCursorIndex({ cursor, data });

	const currentCursorIndex = (index < 1) ? 0 : index;

	const hasPreviousPage = HasPreviousPage({ currentCursorIndex, data, size });

	const startPos = currentCursorIndex - size;

	if (startPos < 1) {
		
		return data.slice(0, currentCursorIndex);
	}

	if (hasPreviousPage) {

		return data.slice(startPos, currentCursorIndex);

	}

	if (currentCursorIndex === 0){
		return [];
	}

	return data.slice(0, size);

}

export const SliceNextData: ISliceNextData = <T extends IDefaultProps>(props: IPaginatorParams<T>): T[] => {
	const data = props.data;
	const cursor = props.params.after ?? '';
	const size = props.params.size ? props.params.size : defaultPerPageSize;
	const dataLimit = data.length - 1;

	if (!cursor) {
		// if not provide a cursor always return array end part
		return data.slice(data.length - size);
	}

	const index = GetCursorIndex({ cursor, data });

	const currentCursorIndex = index === -1 ? 0 : index + 1;

	const hasNextPage = HasNextPage({ currentCursorIndex, data, size });
	
	if (hasNextPage) {
		return data.slice(currentCursorIndex, currentCursorIndex + size);
	}

	if (currentCursorIndex >= dataLimit){
		return [];
	}

	return data.slice(currentCursorIndex);

}

export const ValidateProps: IValidateProps = <T>(props: IPaginatorParams<T>) => {

	const hasAfterAndBeforeCursor = HasAfterAndBeforeCursor(props.params);
	const size = props.params.size ?? defaultPerPageSize;

	props.data.forEach((data): void => {
		if (!ExistId(data)) {
			throw new CustomError(
				{
					message: "paginate: all records on data must have id attribute",
					stack: JSON.stringify(data),
					name: 'paginate'
				}
			);
		}
	});

	if (hasAfterAndBeforeCursor) {
		throw new CustomError(
			{
				message: "paginate: use after or before as cursor param",
				stack: JSON.stringify(props.params),
				name: 'paginate'
			}
		);
	}

	const isValidSize = IsValidSize(size);

	if (!isValidSize) {
		throw new CustomError(
			{
				message: "paginate: size param must be a positive number",
				stack: JSON.stringify(props.params),
				name: 'paginate'
			}
		);
	}
}
