import { Message } from '@entities/message'
import { MessagesRepository } from '@repositories/messages-repository'
import { Result } from '@shared'

export class GetMessages {
	constructor(private readonly messageRepository: MessagesRepository) {}

	async execute(): Promise<Result<Message[]>> {
		const messages = await this.messageRepository.getAll()

		return Result.ok(messages)
	}
}
