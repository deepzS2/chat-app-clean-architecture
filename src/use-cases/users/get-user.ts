import { BaseUseCase } from '@core/base-usecase'
import { UsersRepository } from '@repositories/users-repository'
import { Either, left, Result, right } from '@shared'

import { UserUseCaseDTO } from './dto/user-use-case-dto'
import { UserMissingParams, UserNotFound } from './errors'

interface Request {
	email?: string
	id?: string
}

type Response = Either<UserNotFound | UserMissingParams, Result<UserUseCaseDTO>>

export class GetUser implements BaseUseCase<Request, Response> {
	constructor(private readonly userRepository: UsersRepository) {}

	async execute({ email, id }: Request): Promise<Response> {
		if (!id && !email)
			return left(UserMissingParams.createChoice('id', 'email'))

		const user = id
			? await this.userRepository.findById(id)
			: await this.userRepository.findByEmail(email!)

		if (!user)
			return left(
				id ? UserNotFound.createById(id) : UserNotFound.createByEmail(email!)
			)

		return right(Result.ok(UserUseCaseDTO.fromEntity(user)))
	}
}
