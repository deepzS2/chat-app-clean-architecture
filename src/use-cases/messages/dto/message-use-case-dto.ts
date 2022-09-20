import { Message } from '@entities/message'
import { UserUseCaseDTO } from '@use-cases/users/dto/user-use-case-dto'

export class MessageUseCaseDTO {
	constructor(
		public id: string,
		public authorId: string,
		public content: string,
		public createdAt: Date,
		public author?: UserUseCaseDTO
	) {}

	public static fromEntity(message: Message): MessageUseCaseDTO {
		return new MessageUseCaseDTO(
			message.id,
			message.authorId,
			message.content,
			message.createdAt,
			message.author ? UserUseCaseDTO.fromEntity(message.author) : undefined
		)
	}

	public static fromEntityList(messages: Message[]): MessageUseCaseDTO[] {
		return messages.map(
			(message) =>
				new MessageUseCaseDTO(
					message.id,
					message.authorId,
					message.content,
					message.createdAt,
					message.author ? UserUseCaseDTO.fromEntity(message.author) : undefined
				)
		)
	}
}
