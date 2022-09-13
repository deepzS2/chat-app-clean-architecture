import { it, describe, expect, beforeEach } from 'vitest'

import { User } from '@entities/user'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'
import { JsonWebToken } from '@shared'

import { SessionTerminated } from './errors'
import { IsAuthenticatedUser } from './is-authenticated-user'

describe('Is authenticated user', () => {
	let validToken: string
	let jwt: JsonWebToken
	let repository: InMemoryUsersRepository

	beforeEach(async () => {
		jwt = new JsonWebToken('secret', '1d')
		repository = new InMemoryUsersRepository()

		const user = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		}).getValue()
		await repository.create(user)

		validToken = jwt.createToken({
			id: user.id,
			email: user.email,
			username: user.username,
		})
	})

	it('Should return that the user is authenticated with a valid token', async () => {
		const isAuthenticatedUser = new IsAuthenticatedUser(repository, jwt)

		const result = await isAuthenticatedUser.execute({
			token: validToken,
		})

		expect(result.isRight()).toBeTruthy()
		expect(result.value.getValue()).toBeTruthy()
	})

	it('Should return error if user has invalid token', async () => {
		const isAuthenticatedUser = new IsAuthenticatedUser(repository, jwt)

		const result = await isAuthenticatedUser.execute({
			token: 'invalidToken',
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(SessionTerminated)
	})

	it('Should return error if user do not exists anymore', async () => {
		const user = jwt.verifyToken(validToken).getValue()
		await repository.delete(user.id)

		const isAuthenticatedUser = new IsAuthenticatedUser(repository, jwt)
		const result = await isAuthenticatedUser.execute({
			token: validToken,
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(SessionTerminated)
	})
})
