import { it, describe, expect } from 'vitest'

import { User } from '@entities/user'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'

import { GetUsers } from './get-users'

describe('Get users', () => {
	it('Should return all users', async () => {
		const repository = new InMemoryUsersRepository()
		const getUsers = new GetUsers(repository)

		const user = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		}).getValue()
		await repository.create(user)

		const result = await getUsers.execute()
		const array = result.getValue()

		expect(array.length).toBe(1)
		expect(array).toEqual(expect.arrayContaining([user]))
	})

	it('Should return an empty array if no users registered yet', async () => {
		const repository = new InMemoryUsersRepository()
		const getUsers = new GetUsers(repository)

		const result = await getUsers.execute()
		const array = result.getValue()

		expect(array.length).toBe(0)
	})
})
