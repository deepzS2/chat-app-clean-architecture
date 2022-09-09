import { it, describe, expect } from 'vitest'

import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'

import { CreateUser } from './create-user'
import { EmailAlreadyTaken } from './errors'

describe('Create user', () => {
	it('Should create a new valid user', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const createUser = new CreateUser(usersRepository)

		const result = await createUser.execute({
			email: 'fake@mail.com',
			password: 'password',
			username: 'username',
		})

		expect(result.isRight()).toBeTruthy()
	})

	it('Should not create a new user if email is invalid', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const createUser = new CreateUser(usersRepository)

		const result = await createUser.execute({
			email: 'wrongmail@.com',
			password: 'password',
			username: 'username',
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value.error).not.toBeNull()
	})

	it('Should not create a new user if email is already in use', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const createUser = new CreateUser(usersRepository)

		await createUser.execute({
			email: 'fake@mail.com',
			password: 'password',
			username: 'username',
		})

		const result = await createUser.execute({
			email: 'fake@mail.com',
			password: 'password',
			username: 'username',
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(EmailAlreadyTaken)
	})
})
