import { BaseUseCase } from '@core/base-usecase'
import { MessagesRepository } from '@repositories/messages-repository'
import { UsersRepository } from '@repositories/users-repository'
import { Either, left, Result, right } from '@shared'

import { MessageDTO } from './dto/message-dto'
import { AuthorInvalid, MessageNotFound } from './errors'

interface Request {
	id: string
}

type Response = Either<MessageNotFound, Result<MessageDTO>>

export class GetMessage implements BaseUseCase<Request, Response> {
	constructor(
		private readonly messageRepository: MessagesRepository,
		private readonly userRepository: UsersRepository
	) {}

	async execute({ id }: Request): Promise<Response> {
		const message = await this.messageRepository.findById(id)

		if (!message) {
			return left(MessageNotFound.create(id))
		}

		const user = await this.userRepository.findById(message.authorId)

		if (!user) {
			return left(AuthorInvalid.create(message.authorId))
		}

		message.setAuthor(user)

		return right(Result.ok(MessageDTO.fromEntity(message)))
	}
}
