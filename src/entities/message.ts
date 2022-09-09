import { v4 as uuid } from 'uuid'

import { Result } from '@shared'

import { User } from './user'

interface MessageProps {
	id?: string
	content: string
	authorId: string
	author?: User
}

export class Message {
	private constructor(private props: MessageProps) {}

	get id() {
		return this.props.id!
	}

	get content() {
		return this.props.content
	}

	get authorId() {
		return this.props.authorId
	}

	get author() {
		return this.props.author!
	}

	static create(props: MessageProps): Result<Message> {
		return Result.ok(
			new Message({
				...props,
				id: props.id || uuid(),
			})
		)
	}
}
