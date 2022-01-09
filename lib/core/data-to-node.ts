import { IDefaultProps, INode, IDataToNode } from "../types/types";

/**
 * 
 * @param data array of records
 * @returns array of nodes
 */
export const dataToNode: IDataToNode = <T extends IDefaultProps>(data: T[]): INode<T>[] => {
	const nodes = data.map((node): INode<T> => {
		return {
			node,
			cursor: node?.id as string
		}
	});

	return nodes;
}

export default dataToNode;
