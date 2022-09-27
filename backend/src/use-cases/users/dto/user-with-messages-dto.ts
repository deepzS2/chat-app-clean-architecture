import { Message } from '@entities/message'
import { User } from '@entities/user'
import { MessageDTO } from '@use-cases/messages/dto/message-dto'

export class UserWithMessagesDTO {
	constructor(
		public id: string,
		public username: string,
		public email: string,
		public messages: MessageDTO[]
	) {}

	public static fromEntity(
		user: User,
		messages: Message[] = []
	): UserWithMessagesDTO {
		return new UserWithMessagesDTO(
			user.id,
			user.username,
			user.email,
			messages.map((message) => MessageDTO.fromEntity(message))
		)
	}
}
