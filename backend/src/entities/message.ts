import { v4 as uuid } from 'uuid'

import { Result } from '@shared'

import { User } from './user'

export interface MessageProps {
	id?: string
	content: string
	authorId: string
	createdAt?: Date
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

	get createdAt() {
		return this.props.createdAt!
	}

	setAuthor(value: User) {
		this.props.author = value
	}

	update(propsToUpdate: Partial<Omit<MessageProps, 'id'>>) {
		this.props = Object.assign(this.props, propsToUpdate)
	}

	static fromModel(props: MessageProps) {
		return new Message(props)
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
				createdAt: props.createdAt || new Date(),
			})
		)
	}
}
