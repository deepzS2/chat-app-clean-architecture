import { it, describe, expect } from 'vitest'

import { User } from '@entities/user'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'

import { UserMissingParams, UserNotFound } from './errors'
import { GetUser } from './get-user'

describe('Get user', () => {
	it('Should get an user by ID and email', async () => {
		const repository = new InMemoryUsersRepository()
		const getUser = new GetUser(repository)

		const user = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		}).getValue()
		await repository.create(user)

		const getById = await getUser.execute({
			id: user.id,
		})
		const getByEmail = await getUser.execute({
			email: user.email,
		})

		expect(getById.isRight()).toBeTruthy()
		expect(getByEmail.isRight()).toBeTruthy()
	})

	it('Should not succeed if user not found', async () => {
		const repository = new InMemoryUsersRepository()
		const getUser = new GetUser(repository)

		const getById = await getUser.execute({
			id: 'id',
		})
		const getByEmail = await getUser.execute({
			email: 'email@email.com',
		})

		expect(getById.isLeft()).toBeTruthy()
		expect(getByEmail.isLeft()).toBeTruthy()
		expect(getById.value).toBeInstanceOf(UserNotFound)
		expect(getByEmail.value).toBeInstanceOf(UserNotFound)
	})

	it('Should return error if ID or email not provided', async () => {
		const repository = new InMemoryUsersRepository()
		const getUser = new GetUser(repository)

		const result = await getUser.execute({
			email: undefined,
			id: undefined,
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(UserMissingParams)
	})
})
