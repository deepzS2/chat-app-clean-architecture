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

	update(propsToUpdate: Partial<Omit<MessageProps, 'id'>>) {
		this.props = Object.assign(this.props, propsToUpdate)
	}

	static create(props: MessageProps): Result<Message> {
		if (!props.content) {
			return Result.fail({
				content: 'Please provide a content to create a message',
			})
		}

		if (!props.authorId) {
			return Result.fail({
				authorId: 'Please provide an author to create a message',
			})
		}

		return Result.ok(
			new Message({
				...props,
				id: props.id || uuid(),
			})
		)
	}
}
