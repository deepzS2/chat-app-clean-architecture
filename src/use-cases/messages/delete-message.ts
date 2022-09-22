import { BaseUseCase } from '@core/base-usecase'
import { MessagesRepository } from '@repositories/messages-repository'
import { Either, left, Result, right } from '@shared'

import { MessageDTO } from './dto/message-dto'
import { MessageNotFound, UnauthorizedOwner } from './errors'

interface Request {
	id: string
	userId: string
}

type Response = Either<MessageNotFound | UnauthorizedOwner, Result<MessageDTO>>

export class DeleteMessage implements BaseUseCase<Request, Response> {
	constructor(private readonly messageRepository: MessagesRepository) {}

	async execute({ userId, id }: Request): Promise<Response> {
		const message = await this.messageRepository.findById(id)

		if (!message) return left(MessageNotFound.create(id))
		if (message.authorId !== userId) return left(UnauthorizedOwner.create())

		await this.messageRepository.delete(id)

		return right(Result.ok(MessageDTO.fromEntity(message)))
	}
}
