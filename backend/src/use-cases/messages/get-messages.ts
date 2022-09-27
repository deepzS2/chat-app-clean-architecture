import { BaseUseCase } from '@core/base-usecase'
import { MessageProps } from '@entities/message'
import { MessagesRepository } from '@repositories/messages-repository'
import { Result } from '@shared'

import { MessageDTO } from './dto/message-dto'

interface Request {
	orderBy?: 'asc' | 'desc'
	key?: keyof MessageProps
	page?: number
	limitPerPage?: number
}

type Response = Result<MessageDTO[]>

export class GetMessages implements BaseUseCase<Request, Response> {
	constructor(private readonly messageRepository: MessagesRepository) {}

	async execute({
		key = 'id',
		orderBy = 'asc',
		page = 1,
		limitPerPage = 10,
	}: Request): Promise<Response> {
		const messages = await this.messageRepository.getAllOrdered(key, orderBy, {
			page,
			limitPerPage,
		})

		return Result.ok(MessageDTO.fromEntityList(messages))
	}
}
