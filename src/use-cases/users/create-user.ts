import { BaseUseCase } from '@core/base-usecase'
import { User } from '@entities/user'
import { UsersRepository } from '@repositories/users-repository'
import { Either, left, Result, right } from '@shared'

import { UserUseCaseDTO } from './dto/user-use-case-dto'
import { EmailAlreadyTaken, InvalidUserProps } from './errors'

interface Request {
	username: string
	email: string
	password: string
}

type Response = Either<
	EmailAlreadyTaken | InvalidUserProps,
	Result<UserUseCaseDTO>
>

export class CreateUser implements BaseUseCase<Request, Response> {
	constructor(private readonly userRepository: UsersRepository) {}

	async execute({ email, password, username }: Request): Promise<Response> {
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

		return right(Result.ok(UserUseCaseDTO.fromEntity(user)))
	}
}
