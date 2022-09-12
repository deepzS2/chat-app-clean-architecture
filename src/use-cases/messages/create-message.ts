import { Message } from '@entities/message'
import { MessagesRepository } from '@repositories/messages-repository'
import { UsersRepository } from '@repositories/users-repository'
import { Either, left, Result, right } from '@shared'

import { AuthorInvalid, InvalidMessageProps, NoMessageContent } from './errors'

interface CreateUserRequest {
	content: string
	authorId: string
}

type CreateUserResponse = Either<
	NoMessageContent | AuthorInvalid | InvalidMessageProps,
	Result<Message>
>

export class CreateMessage {
	constructor(
		private readonly userRepository: UsersRepository,
		private readonly messageRepository: MessagesRepository
	) {}

	async execute({
		authorId,
		content,
	}: CreateUserRequest): Promise<CreateUserResponse> {
		const userExists = await this.userRepository.findById(authorId)

		if (!userExists) return left(AuthorInvalid.create(authorId))

		const messageInstance = Message.create({
			content,
			authorId,
			author: userExists,
		})

		if (messageInstance.isFailure) {
			return left(InvalidMessageProps.create(messageInstance.getValue()))
		}

		const message = messageInstance.getValue()

		await this.messageRepository.create(message)

		return right(Result.ok(message))
	}
}
