import {
	IGqlResult,
	IPageInfo,
	IPager,
	IPaginateConfig,
	IPagination,
	IProps,
	IRestResult
} from "../types/types";
import { CustomError } from "../utils";

/**
 * @description this function receives a vector of records and slice it following provided criterial
 * @param props as object
 * @summary on props `data` is a vector of records coming from the database or any service.
 * @summary on props `params` is the criterial settings
 * @requires id attribute on each data item by default.
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
 * 
 * const pager = new Pager().paginate;
 * 
 * const result = pager({
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
 * @param pageInfo.cursor as String.
 * 
 * @example
 * {
 *		data,
 *		pageInfo: {
 *			totalCount,
 *			hasNextPage,
 *			hasPreviousPage,
 *			sizePerPage,
 *			currentItem,
 *			page: { current, of },
 *			firstCursor,
 *			lastCursor,
 *		}
 *	}
 * 
 */
export class Pager implements IPager {
	private readonly config: IPaginateConfig;
	private payload: any[] = [];
	private originalData: any[] = [];
	private cursor?: string = undefined;

	private pagination: IPagination = {
		after: undefined,
		before: undefined,
		size: undefined,
	}

	private pageInfo: IPageInfo = {
		hasNextPage: false,
		hasPreviousPage: false,
		totalCount: 0,
		sizePerPage: 0,
		currentItem: 0,
		page: {
			current: 0,
			of: 0
		},
		firstCursor: undefined,
		lastCursor: undefined
	};

	constructor(config?: IPaginateConfig) {
		this.config = config ?? {
			cursorKey: 'id',
			pageSize: 25
		}
	}
		
	private setData<T>(props: IProps<T>): void {
		this.pagination = {
			after: props?.params?.after,
			before: props?.params?.before,
			size: props?.params?.size ?? this.config.pageSize
		};
		this.payload = [];
		this.originalData = props.data;
		this.pageInfo.totalCount = props.data.length;
	}
	
	private handleErrors(): void {
		this.originalData.forEach((reg): void => {
			if (!reg[this.config.cursorKey]) {
				throw new CustomError(
					{
						message: `paginate: all records on data must have ${this.config.cursorKey} attribute`,
						stack: JSON.stringify(reg),
						name: 'paginate'
					}
				);
			}
		});

		if (this.pagination.after && this.pagination.before) {
			throw new CustomError(
				{
					message: "paginate: use after or before as cursor param",
					stack: JSON.stringify(this.pagination),
					name: 'paginate'
				}
			);
		}
	
		const cursor = this.pagination.after ?? this.pagination.before;

		if (cursor) {
			const index = this.originalData.findIndex((reg) => reg?.[this.config.cursorKey] === cursor);
			if (index === -1) {
				throw new CustomError({
					message: `provided cursor: ${cursor} does not exits on data`,
					name: 'paginate',
					stack: JSON.stringify(this.pagination)
				})
				
			}
		}

		const isValidSize = this.pagination.size === undefined || this.pagination.size > 0;
	
		if (!isValidSize) {
			throw new CustomError(
				{
					message: "paginate: size param must be a positive number",
					stack: JSON.stringify(this.pagination),
					name: 'paginate'
				}
			);
		}

	}

	private getCursorIndex(): number {
		const cursor = this.pagination.after ?? this.pagination.before;
		return this.originalData.findIndex((el) => el?.[this.config.cursorKey] === cursor);
	}

	private backwardFlow() {

		const cursorIndex = this.getCursorIndex();
		const size = this.pagination.size ?? this.config.pageSize;

		const existPrevPage = this.existPrevPage(cursorIndex, size);

		if (existPrevPage) {

			const isNegative = (cursorIndex - size) < 0;
			const prevPosition = isNegative ? 0 : cursorIndex - size;

			this.cursor = this.originalData[prevPosition]?.[this.config.cursorKey] ??
				this.originalData[0]?.[this.config.cursorKey];
			
			this.payload = this.originalData.slice(prevPosition, cursorIndex);
			return;

		}
		this.payload = [];
	}
	
	private forwardFlow() {

		const cursorIndex = this.getCursorIndex();
		const size = this.pagination.size ?? this.config.pageSize;

		const existNextPage = this.existNextPage(cursorIndex);

		if (existNextPage) {
			
			this.cursor = this.originalData[cursorIndex + size]?.[this.config.cursorKey] ??
				this.originalData[this.pageInfo.totalCount - 1]?.[this.config.cursorKey];
			
			this.payload = this.originalData.slice(cursorIndex + 1, cursorIndex + size + 1);

			return;
		}

		this.payload = [];
	 }

	private defaultFlow() {
		const size = this.pagination.size ?? this.config.pageSize;
		this.payload = this.originalData.slice(0, size);
		this.cursor = this.originalData[size]?.[this.config.cursorKey];
	}

	private updateNextAndPrev(): void {

		if (this.payload.length < 1) {

			const message = this.pagination.after ? `after cursor: ${this.pagination.after}` : `before cursor: ${this.pagination.before}`;

			throw new CustomError({
				message: `there is not data ${message}`,
				name: 'paginate',
				stack: JSON.stringify(this.pagination)
			})
		}

		const key = this.config.cursorKey;

		const payloadLength = this.payload.length - 1;

		const firstIndex = this.originalData.findIndex((el) => el?.[key] === this.payload[0]?.[key]);
		const lastIndex = this.originalData.findIndex((el) => el?.[key] === this.payload[payloadLength]?.[key]);


		const backPosition = this.pagination.size ?? (this.pageInfo.totalCount - 1) - (this.payload.length);

		this.pageInfo.firstCursor = this.payload?.[0]?.[key] ?? this.cursor;
		this.pageInfo.lastCursor = this.payload?.[backPosition - 1]?.[key] ?? this.cursor;

		this.pageInfo.hasNextPage = this.originalData[lastIndex + 1]?.[key] !== undefined;
		this.pageInfo.hasPreviousPage = this.originalData[firstIndex - 1]?.[key] !== undefined;

	}

	private updatePageDetails() {
		
		const key = this.config.cursorKey;
		const firstIndex = this.originalData.findIndex((el) => el?.[key] === this.payload[0]?.[key]);

		this.pageInfo.sizePerPage = this.pagination.size ?? this.config.pageSize;
		this.pageInfo.currentItem = firstIndex + 1;

		const currentPage = this.pageInfo.currentItem / this.pageInfo.sizePerPage;
		const lastPage = this.pageInfo.totalCount / this.pageInfo.sizePerPage;

		this.pageInfo.page.current = Math.ceil(currentPage);
		this.pageInfo.page.of = Math.ceil(lastPage);

		if (!this.pageInfo.hasNextPage) {
			this.pageInfo.page.current = this.pageInfo.page.of;
		}	

		if (this.pageInfo.hasPreviousPage && this.pageInfo.page.current === 1) {
			this.pageInfo.page.current = this.pageInfo.page.current + 1;
		}
	}

	private toRest = <T>(): IRestResult<T> => {
		const isBefore = this.pagination?.before;
		const isAfter = this.pagination?.after;

		if (this.originalData.length < 1) {
			return {
				data: [],
				pageInfo: {
					...this.pageInfo,
					lastCursor: isBefore ?? isAfter,
					firstCursor: isBefore ?? isAfter,
				}
			}
		}
		
		if (this.pageInfo.totalCount <= this.pageInfo.sizePerPage) {
			return {
				data: this.originalData,
				pageInfo: {
					hasNextPage: false,
					hasPreviousPage: false,
					page: {
						current: 1,
						of: 1
					},
					currentItem: 1,
					sizePerPage: this.pageInfo.totalCount,
					totalCount: this.pageInfo.totalCount,
					firstCursor: this.originalData[0]?.[this.config.cursorKey],
					lastCursor: this.originalData[this.originalData.length - 1]?.[this.config.cursorKey],
				}
			}
		}

		if (isBefore) {
			this.backwardFlow();

		} else if (isAfter) {
			this.forwardFlow();

		} else if (!isAfter && !isBefore) {
			this.defaultFlow();
		}

		this.updateNextAndPrev();
		this.updatePageDetails();

		return {
			data: this.payload as Array<T>,
			pageInfo: this.pageInfo
		}

	}

	private toGql = <T>(): IGqlResult<T> => {
		this.toRest();
		const nodes = this.payload.map((node: T) => ({
			node: node,
			cursor: node?.[this.config.cursorKey] as string
		}));

		return {
			data: nodes,
			pageInfo: this.pageInfo
		}
	}

	private existNextPage(cursorIndex: number): boolean {
		const existNextPage = cursorIndex < (this.pageInfo.totalCount - 1) && cursorIndex >= 0;
		return existNextPage;
	}

	private existPrevPage(cursorIndex: number, size: number): boolean {
		const existPrevPage = cursorIndex > 0 || (cursorIndex - size) >= 0;
		return existPrevPage;
	}
	
	/**
	 * @description this function receives a vector of records and slice it following provided criterial
	 * @param props as object
	 * @summary on props `data` is a vector of records coming from the database or any service.
	 * @summary on props `params` is the criterial settings
	 * @requires id attribute on each data item by default.
	 * 
	 * @param props Object
	 * @param props.data Array of Objects. Oject must have id attribute.
	 * @param props.params Object
	 * @param props.params.after String optional as item cursor value.
	 * @param props.params.before String optional as item cursor value.
	 * @param props.params.size Number optional.
	 * 
	 * @default props.params.size 25
	 * 
	 * @example 
	 * const pager = new Pager();
	 * 
	 * const result = pager.paginate({
	 *		data: Records,
	 *		params: {
	 *			size: 7,
	 *			after: 'record_id'
	 *		}
	 *	}).toRest();
	 * 
	**/
	paginate = <T>(props: IProps<T>)=> {
		this.setData(props);
		this.handleErrors();
		return {
			toGql: ()=> this.toGql<T>(),
			toRest: ()=> this.toRest<T>()
		}
	};
}

export default Pager;
