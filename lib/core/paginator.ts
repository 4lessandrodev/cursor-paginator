import { IPaginator, IPaginatorParams, IPaginatorResult } from "../../types";
import { HasAfterAndBeforeCursor, HasAfterCursorParam, HasBeforeCursorParam } from "../utils/validations.utils";

export const defaultPerPageSize = 25;

export const Paginator: IPaginator = <T>(props: IPaginatorParams<T>): IPaginatorResult<T> => {

	const hasAfterAndBeforeCursor = HasAfterAndBeforeCursor(props.params);

	if (hasAfterAndBeforeCursor) {
		throw new Error("use after or before as cursor param");
	}

	const isAfter = HasAfterCursorParam(props.params);
	// CALLS AFTER LOGIC 
	if (isAfter) {

	}


	
	const isBefore = HasBeforeCursorParam(props.params);
	// CALLS BEFORE LOGIC
	if (isBefore) {

	}

	// EXECUTE DEFAULT PROPS
	return {
		data: [],
		pageInfo: {
			hasNextPage: false,
			hasPreviousPage: false,
			totalCount: 0,
			currentCursor: undefined,
			nextCursor: undefined,
			previousCursor: undefined
		}
	}
}

export default Paginator;
