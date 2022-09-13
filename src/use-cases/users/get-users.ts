import { BaseUseCase } from '@core/base-usecase'
import { User } from '@entities/user'
import { UsersRepository } from '@repositories/users-repository'
import { Result } from '@shared'

type Request = unknown
type Response = Result<User[]>

export class GetUsers implements BaseUseCase<Request, Response> {
	constructor(private readonly userRepository: UsersRepository) {}

	async execute(): Promise<Result<User[]>> {
		const user = await this.userRepository.getAll()

		return Result.ok(user)
	}
}
