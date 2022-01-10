import { IUser, makeFakeUsers } from './make-data';
import { IGqlResult, IRestResult } from '../dist/types/types';
import { Pager } from '../dist';

// Create a paginate instance
const paginate = new Pager().paginate;

// simple example rest api approach
const simpleExample = (data: IUser[]): IRestResult<IUser> => {

	const restPagination = paginate<IUser>({
		data,
		params: {
			after: '51',
			size: 10
		}
	}).toRest();

	console.log('Simple pagination');
	console.log(restPagination);

	return restPagination;
}

// simple example GQL approach
const gqlExample = (data: IUser[]): IGqlResult<IUser> => {

	console.log('\nGql nodes pagination');

	const gqlPagination = paginate({
		data,
		params: {
			after: '51',
			size: 10
		}
	}).toGql()


	console.log(gqlPagination);
	return gqlPagination;

}

// main function
const main = (): void => {
	const data = makeFakeUsers(100);

	simpleExample(data);
	gqlExample(data);

}

main();
