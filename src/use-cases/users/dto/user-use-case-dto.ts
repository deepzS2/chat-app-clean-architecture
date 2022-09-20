import { Message } from '@entities/message'
import { User } from '@entities/user'
import { MessageUseCaseDTO } from '@use-cases/messages/dto/message-use-case-dto'

export class UserUseCaseDTO {
	constructor(
		public id: string,
		public username: string,
		public email: string,
		public messages?: MessageUseCaseDTO[]
	) {}

	public static fromEntity(user: User, messages?: Message[]): UserUseCaseDTO {
		return new UserUseCaseDTO(
			user.id,
			user.username,
			user.email,
			messages?.length
				? messages?.map((message) => MessageUseCaseDTO.fromEntity(message))
				: undefined
		)
	}

	public static fromEntityList(users: User[]): UserUseCaseDTO[] {
		return users.map(
			(user) =>
				new UserUseCaseDTO(user.id, user.username, user.email, undefined)
		)
	}
}
