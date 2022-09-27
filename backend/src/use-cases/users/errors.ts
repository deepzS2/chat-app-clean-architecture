import { User } from '@entities/user'
import { DomainError, Result } from '@shared'

export class EmailAlreadyTaken extends Result<DomainError> {
	private constructor(email: string) {
		super(false, {
			message: `The email "${email}" has already been taken.`,
		})
	}

	public static create(email: string): EmailAlreadyTaken {
		return new EmailAlreadyTaken(email)
	}
}

export class UserMissingParams extends Result<DomainError> {
	private constructor(choice: boolean, params: Array<keyof User>) {
		super(false, {
			message: `Missing parameters: ${params.join(choice ? ' or ' : ', ')}`,
		})
	}

	public static create(...params: Array<keyof User>): UserMissingParams {
		return new UserMissingParams(false, params)
	}

	public static createChoice(...params: Array<keyof User>): UserMissingParams {
		return new UserMissingParams(true, params)
	}
}

export class InvalidUserProps extends Result<DomainError> {
	private constructor(propsInvalid: User) {
		super(false, {
			message: `Invalid properties`,
			error: propsInvalid,
		})
	}

	public static create(propsInvalid: User): InvalidUserProps {
		return new InvalidUserProps(propsInvalid)
	}
}

export class UserNotFound extends Result<DomainError> {
	private constructor(message: string) {
		super(false, {
			message,
		})
	}

	public static createById(id: string): UserNotFound {
		return new UserNotFound(`User not found with ID "${id}"`)
	}

	public static createByEmail(email: string): UserNotFound {
		return new UserNotFound(`User not found with email "${email}"`)
	}
}

export class InvalidCredentials extends Result<DomainError> {
	constructor() {
		super(false, {
			message: 'Email or password invalid',
		})
	}

	public static create(): InvalidCredentials {
		return new InvalidCredentials()
	}
}

export class SessionTerminated extends Result<DomainError> {
	constructor() {
		super(false, {
			message: 'Token expired or user does not exists anymore...',
		})
	}

	public static create(): SessionTerminated {
		return new SessionTerminated()
	}
}
