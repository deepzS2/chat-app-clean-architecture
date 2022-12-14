import { Message } from '@entities/message'
import { DomainError, Result } from '@shared'

export class AuthorInvalid extends Result<DomainError> {
	private constructor(id: string) {
		super(false, {
			message: `The author id "${id}" does not exists...`,
		})
	}

	public static create(id: string): AuthorInvalid {
		return new AuthorInvalid(id)
	}
}

export class NoMessageContent extends Result<DomainError> {
	private constructor() {
		super(false, {
			message: `Please provide a content to create a message`,
		})
	}

	public static create(): NoMessageContent {
		return new NoMessageContent()
	}
}

export class MessageNotFound extends Result<DomainError> {
	private constructor(id: string) {
		super(false, {
			message: `Message not found with that id ${id}`,
		})
	}

	public static create(id: string): MessageNotFound {
		return new MessageNotFound(id)
	}
}

export class UnauthorizedOwner extends Result<DomainError> {
	private constructor() {
		super(false, {
			message: `You're not the owner of this message!`,
		})
	}

	public static create(): UnauthorizedOwner {
		return new UnauthorizedOwner()
	}
}

export class InvalidMessageProps extends Result<DomainError> {
	private constructor(propsInvalid: Message) {
		super(false, {
			message: `Invalid properties`,
			error: propsInvalid,
		})
	}

	public static create(propsInvalid: Message): InvalidMessageProps {
		return new InvalidMessageProps(propsInvalid)
	}
}
