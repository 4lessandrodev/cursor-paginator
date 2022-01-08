export interface IDefaultProps {
	id: string;
}

export interface IPageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	totalCount: number;
	nextCursor?: string;
	previousCursor?: string;
	currentCursor?: string;
}

export interface IPaginatorResult<T> {
	data: T[];
	pageInfo: IPageInfo;
}

export interface IParams {
	after?: string;
	before?: string;
	size?: number;
}

export interface IPaginatorParams<T> {
	data: T[];
	params: IParams;
}

export interface IGetCursorIndexParams<T> {
	data: T[];
	cursor: string;
}

export interface IHasNestCursor<T> {
	data: T[];
	currentCursorIndex: number;
	size: number;
}

export interface INode<T> {
	node: T;
	cursor: string;
}

export interface IGetRangeParams<T> {
	originalData: T[];
	dataPayload: T[];
}

export interface IHasNextAndPrev {
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}

export type IHasAfterCursor = (params: IParams) => boolean;
export type IHasBeforeCursor = (params: IParams) => boolean;
export type IHasAfterAndBeforeCursor = (params: IParams) => boolean;
export type IHasPaginateSize = (params: IParams) => boolean;
export type IGetCursorIndex = <T extends IDefaultProps>(params: IGetCursorIndexParams<T>) => number;
export type IHasNextPage = <T>(params: IHasNestCursor<T>) => boolean;
export type IHasPreviousPage = <T>(params: IHasNestCursor<T>) => boolean;
export type IGetNextCursor = <T extends IDefaultProps>(params: IPaginatorParams<T>) => string | undefined;
export type IGetPreviousCursor = <T extends IDefaultProps>(params: IPaginatorParams<T>) => string | undefined;
export type ISlicePreviousData = <T  extends IDefaultProps>(params: IPaginatorParams<T>) => T[];
export type ISliceNextData = <T extends IDefaultProps>(params: IPaginatorParams<T>) => T[];
export type IValidateSize = (size: number) => boolean;
export type IDataToNode = <T extends IDefaultProps>(data: T[]) => Array<INode<T>>;
export type IExistId = <T>(data: T) => boolean;
export type IGetNextAndPrevPagination = <T extends IDefaultProps>(props: IGetRangeParams<T>) => IHasNextAndPrev;
export type IValidateProps = <T extends IDefaultProps>(params: IPaginatorParams<T>) => void;

export type IPaginator = <T extends IDefaultProps>(params: IPaginatorParams<T>) => IPaginatorResult<T>;
