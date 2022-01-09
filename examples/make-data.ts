export interface IUser {
	id: string;
	name: string;
	age: number;
	password: string;
	createdAt: Date;
}

const fakeData: IUser[] = [];

export const makeFakeUsers = (quantity: number):IUser[] => {
	
	// removes all data
	fakeData.splice(0, fakeData.length);

	if (quantity < 0 || quantity > 500) {
		throw new Error("use quantity 0 to 500");
	}

	// create users
	for (let index = 0; index <= quantity; index++) {
		const user: IUser = {
			id: String(index),
			name: `some name ${index}`,
			age: Math.trunc(Math.random() * 100),
			password: String(Math.trunc(Math.random() * 1000)) + 'ABC#$' + index,
			createdAt: new Date()
		}
		fakeData.push(user);
	}

	return fakeData;
}

export default makeFakeUsers;
