export interface IPagination {
	after?: string;
	before?: string;
	size?: number;
}

export interface INode<T> {
	node: T,
	cursor: string
}

export interface IProps<T> {
	data: T[],
	params?: IPagination
}

export interface IRestResult<T> {
	data: T[];
	pageInfo: IPageInfo;
}

export interface IGqlResult<T> {
	data: INode<T>[];
	pageInfo: IPageInfo;
}

export interface IPaginateConfig {
	cursorKey: string;
	pageSize: number;
}

export interface IPageInfo {
	totalCount: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	cursor?: string;
}

export interface IPager {
	paginate: <T>(data: IProps<T>) => {
		toGql: <T>() => IGqlResult<T>;
		toRest: <T>() => IRestResult<T>;
	}
}
