import { User } from '@entities/user'
import { UsersRepository } from '@repositories/users-repository'
import { Either, left, Result, right } from '@shared'

import { EmailAlreadyTaken, InvalidUserProps } from './errors'

interface CreateUserRequest {
	username: string
	email: string
	password: string
}

type CreateUserResponse = Either<
	EmailAlreadyTaken | InvalidUserProps,
	Result<User>
>

export class CreateUser {
	constructor(private readonly userRepository: UsersRepository) {}

	async execute({
		email,
		password,
		username,
	}: CreateUserRequest): Promise<CreateUserResponse> {
		const userExists = await this.userRepository.findByEmail(email)

		if (userExists) return left(EmailAlreadyTaken.create(email))

		const userInstance = User.create({
			email,
			username,
			password,
		})

		if (userInstance.isFailure) {
			return left(InvalidUserProps.create(userInstance.getValue()))
		}

		const user = userInstance.getValue()

		await this.userRepository.create(user)

		return right(Result.ok(user))
	}
}
