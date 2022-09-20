import { BaseUseCase } from '@core/base-usecase'
import { User } from '@entities/user'
import { UsersRepository } from '@repositories/users-repository'
import { Either, left, Result, right } from '@shared'

import { UserUseCaseDTO } from './dto/user-use-case-dto'
import { UserMissingParams, UserNotFound } from './errors'

interface Request {
	id: string
	data: Partial<User>
}

type Response = Either<UserNotFound | UserMissingParams, Result<UserUseCaseDTO>>

export class UpdateUser implements BaseUseCase<Request, Response> {
	constructor(private readonly userRepository: UsersRepository) {}

	async execute({ data, id }: Request): Promise<Response> {
		if (!id) return left(UserMissingParams.create('id'))

		const user = await this.userRepository.findById(id)

		if (!user) return left(UserNotFound.createById(id))

		await this.userRepository.update(id, data)

		return right(Result.ok(UserUseCaseDTO.fromEntity(user)))
	}
}
