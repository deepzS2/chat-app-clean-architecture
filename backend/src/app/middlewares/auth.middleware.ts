import { Request, Response, NextFunction } from 'express'

import { BaseMiddleware } from '@core/base-middleware'
import { UsersRepository } from '@repositories/users-repository'
import { JsonWebToken } from '@shared'
import { IsAuthenticatedUser } from '@use-cases/users/is-authenticated-user'

export class AuthMiddleware implements BaseMiddleware {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly jwt: JsonWebToken
	) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<any> {
		const isAuthenticatedUser = new IsAuthenticatedUser(
			this.usersRepository,
			this.jwt
		)

		if (!req.headers.authorization) {
			return res.status(401).send({
				message: `You don't have permission to access this route`,
			})
		}

		const [bearer, token] = req.headers.authorization.split(' ')

		if (bearer !== 'Bearer') {
			return res.status(401).send({
				message: `Invalid token`,
			})
		}

		const result = await isAuthenticatedUser.execute({
			token,
		})

		if (result.isLeft()) {
			return res.status(401).send(result.value.getValue())
		}

		const user = result.value.getValue()

		req.user = {
			email: user.email,
			id: user.id,
			username: user.username,
		}

		return next()
	}
}
