import { BaseUseCase } from '@core/base-usecase'
import { UsersRepository } from '@repositories/users-repository'
import { Result } from '@shared'

import { UserDTO } from './dto/user-dto'

type Request = unknown
type Response = Result<UserDTO[]>

export class GetUsers implements BaseUseCase<Request, Response> {
	constructor(private readonly userRepository: UsersRepository) {}

	async execute(): Promise<Response> {
		const users = await this.userRepository.getAll()

		return Result.ok(users.map((user) => UserDTO.fromEntity(user)))
	}
}
