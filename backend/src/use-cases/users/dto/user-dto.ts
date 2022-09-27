import { User } from '@entities/user'

export class UserDTO {
	constructor(
		public id: string,
		public username: string,
		public email: string
	) {}

	public static fromEntity(user: User): UserDTO {
		return new UserDTO(user.id, user.username, user.email)
	}

	public static fromEntityList(users: User[]): UserDTO[] {
		return users.map((user) => new UserDTO(user.id, user.username, user.email))
	}
}
