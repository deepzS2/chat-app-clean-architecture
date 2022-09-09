import { User } from '@entities/user'
import { UsersRepository } from '@repositories/users-repository'
import { Either, left, Result, right } from '@shared'

import { EmailAlreadyTaken } from './errors'

interface CreateUserRequest {
	username: string
	email: string
	password: string
}

type CreateUserResponse = Either<EmailAlreadyTaken, Result<User>>

export class CreateUser {
	constructor(private readonly userRepository: UsersRepository) {}

	async execute({
		email,
		password,
		username,
	}: CreateUserRequest): Promise<CreateUserResponse> {
		const userExists = await this.userRepository.findByEmail(email)

		if (userExists) return left(EmailAlreadyTaken.create(email))

		const user = User.create({
			email,
			username,
			password,
		})

		await this.userRepository.create(user)

		return right(Result.ok(user))
	}
}
