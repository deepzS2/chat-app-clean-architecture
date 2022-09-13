import { it, describe, expect, beforeEach } from 'vitest'

import { User } from '@entities/user'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'
import { JsonWebToken } from '@shared'

import { InvalidCredentials, UserNotFound } from './errors'
import { LoginUser } from './login-user'

describe('Login user', () => {
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
	})

	it('Should authenticate the user and return token', async () => {
		const loginUser = new LoginUser(repository, jwt)

		const result = await loginUser.execute({
			email: 'email@email.com',
			password: 'password',
		})

		expect(result.isRight()).toBeTruthy()
		expect(result.value).not.toBeInstanceOf(UserNotFound)
		expect(result.value).not.toBeInstanceOf(InvalidCredentials)
		expect(result.value.getValue()).toHaveProperty('token')
	})

	it('Should return error if user not found with the email provided', async () => {
		const loginUser = new LoginUser(repository, jwt)

		const result = await loginUser.execute({
			email: 'notexists@email.com',
			password: 'password',
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(UserNotFound)
	})

	it('Should return error if credentials are invalid', async () => {
		const loginUser = new LoginUser(repository, jwt)

		const result = await loginUser.execute({
			email: 'email@email.com',
			password: 'passwordinvalid123',
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).not.toBeInstanceOf(UserNotFound)
		expect(result.value).toBeInstanceOf(InvalidCredentials)
	})
})
