import { paginate, dataToNode } from '../dist';
import { IPaginatorResult } from '../dist/types/types';
import { IUser, makeFakeUsers } from './make-data';

// simple example rest api approach
const simpleExample = (data: IUser[]): IPaginatorResult<IUser> => {

	const pagination = paginate({
		data,
		params: {
			after: '51',
			size: 10
		}
	});

	console.log('Simple pagination');
	console.log(pagination);

	return pagination;
}

// simple example GQL approach
const gqlExample = (pagination:  IPaginatorResult<IUser>): void => {

	console.log('Gql nodes pagination');
	const nodes = dataToNode(pagination.data);

	const gqlPagination = {
		data: nodes,
		pageInfo: pagination.pageInfo
	}

	console.log(gqlPagination);

}

// main function
const main = (): void => {
	const data = makeFakeUsers(100);

	const pages = simpleExample(data);
	console.log('\n');
	gqlExample(pages);

}

main();
