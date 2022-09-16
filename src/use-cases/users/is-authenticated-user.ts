import { JwtPayload } from 'jsonwebtoken'

import { BaseUseCase } from '@core/base-usecase'
import { UsersRepository } from '@repositories/users-repository'
import { Either, JsonWebToken, left, Result, right } from '@shared'

import { SessionTerminated } from './errors'

interface Request {
	token: string
}

type Response = Either<SessionTerminated, Result<JwtPayload>>

export class IsAuthenticatedUser implements BaseUseCase<Request, Response> {
	constructor(
		private readonly userRepository: UsersRepository,
		private readonly jwt: JsonWebToken
	) {}

	async execute({ token }: Request): Promise<Response> {
		const result = this.jwt.verifyToken(token)

		if (result.isFailure) return left(SessionTerminated.create())

		const { id } = result.getValue()
		const userExists = await this.userRepository.findById(id)

		if (!userExists) return left(SessionTerminated.create())

		return right(result)
	}
}
