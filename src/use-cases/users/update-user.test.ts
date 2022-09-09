import { it, describe, expect } from 'vitest'

import { User } from '@entities/user'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'

import { UpdateUser } from './update-user'

describe('Update user', () => {
	it('Should update an user', async () => {
		const repository = new InMemoryUsersRepository()
		const updateUser = new UpdateUser(repository)

		const user = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		}).getValue()
		await repository.create(user)

		const result = await updateUser.execute({
			id: user.id,
			data: {
				email: 'anotheremail@email.com',
			},
		})

		expect(result.isRight()).toBeTruthy()

		const value = result.value.getValue()

		expect(value).toBeInstanceOf(User)
		expect((value as User).email).toBe('anotheremail@email.com')
	})
})
