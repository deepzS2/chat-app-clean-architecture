import { BaseUseCase } from '@core/base-usecase'
import { User } from '@entities/user'
import { UsersRepository } from '@repositories/users-repository'
import { Either, left, Result, right } from '@shared'

import { UserMissingParams, UserNotFound } from './errors'

interface Request {
	email?: string
	id?: string
}

type Response = Either<UserNotFound | UserMissingParams, Result<User>>

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

		return right(Result.ok(user))
	}
}
