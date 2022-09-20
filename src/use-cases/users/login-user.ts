import { BaseUseCase } from '@core/base-usecase'
import { UsersRepository } from '@repositories/users-repository'
import { Either, JsonWebToken, left, Result, right } from '@shared'

import { UserDTO } from './dto/user-dto'
import { InvalidCredentials, UserNotFound } from './errors'

interface Request {
	email: string
	password: string
}

type Response = Either<
	UserNotFound | InvalidCredentials,
	Result<{
		user: UserDTO
		token: string
	}>
>

export class LoginUser implements BaseUseCase<Request, Response> {
	constructor(
		private readonly userRepository: UsersRepository,
		private readonly jwt: JsonWebToken
	) {}

	async execute({ email, password }: Request): Promise<Response> {
		const userExists = await this.userRepository.findByEmail(email)

		if (!userExists) return left(UserNotFound.createByEmail(email))
		if (!userExists.comparePassword(password))
			return left(InvalidCredentials.create())

		const token = this.jwt.createToken({
			id: userExists.id,
			email: userExists.email,
			username: userExists.username,
		})

		return right(
			Result.ok({
				user: UserDTO.fromEntity(userExists),
				token,
			})
		)
	}
}
