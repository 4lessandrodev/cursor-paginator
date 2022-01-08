
interface ErrorProps {
	message: string;
	stack?: string;
	name?: string;
}

export class CustomError extends Error {
	constructor({ message, stack, name }: ErrorProps) {
		super(message);

		this.stack = this.stack + '\n params: ' + stack;
		this.name = name ?? this.name;
	}
}

export default CustomError;
