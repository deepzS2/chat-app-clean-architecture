import { Message } from '@entities/message'
import { UserDTO } from '@use-cases/users/dto/user-dto'

export class MessageDTO {
	constructor(
		public id: string,
		public authorId: string,
		public content: string,
		public createdAt: Date,
		public author?: UserDTO
	) {}

	public static fromEntity(message: Message): MessageDTO {
		return new MessageDTO(
			message.id,
			message.authorId,
			message.content,
			message.createdAt,
			message.author ? UserDTO.fromEntity(message.author) : undefined
		)
	}

	public static fromEntityList(messages: Message[]): MessageDTO[] {
		return messages.map(
			(message) =>
				new MessageDTO(
					message.id,
					message.authorId,
					message.content,
					message.createdAt,
					message.author ? UserDTO.fromEntity(message.author) : undefined
				)
		)
	}
}
