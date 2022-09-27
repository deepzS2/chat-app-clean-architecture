import jwt from 'jsonwebtoken'

import { Result } from './result'
export class JsonWebToken {
	constructor(private readonly SECRET: string, private readonly TTL: string) {}

	verifyToken(token: string): Result<jwt.JwtPayload> {
		try {
			const result = jwt.verify(token, this.SECRET, {})

			return Result.ok(result as jwt.JwtPayload)
		} catch (error) {
			return Result.fail('JWT Invalid')
		}
	}

	createToken<T extends string | object | Buffer>(data: T) {
		return jwt.sign(data, this.SECRET, {
			expiresIn: this.TTL,
		})
	}
}
