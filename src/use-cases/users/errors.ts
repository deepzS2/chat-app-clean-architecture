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

export class EmailInvalid extends Result<DomainError> {
	private constructor(email: string) {
		super(false, {
			message: `The email "${email}" is invalid.`,
		})
	}

	public static create(email: string): EmailInvalid {
		return new EmailInvalid(email)
	}
}

export class InvalidRequestParams extends Result<DomainError> {
	private constructor(params: string[]) {
		super(false, {
			message: `Invalid request parameters: ${params.join(', ')}`,
		})
	}

	public static create(...params: string[]): InvalidRequestParams {
		return new InvalidRequestParams(params)
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
