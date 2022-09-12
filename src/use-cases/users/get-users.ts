import { User } from '@entities/user'
import { UsersRepository } from '@repositories/users-repository'
import { Result } from '@shared'

export class GetUsers {
	constructor(private readonly userRepository: UsersRepository) {}

	async execute(): Promise<Result<User[]>> {
		const user = await this.userRepository.getAll()

		return Result.ok(user)
	}
}
