import { it, describe, expect } from 'vitest'

import { User } from './user'

describe('User entity', () => {
	it('Should create a new user entity, hash password and generate an UUID', () => {
		const entity = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		})

		expect(entity).toBeInstanceOf(User)
		expect(entity.id).not.toBeNull()
		expect(entity.password).not.toBe('password')
	})

	it('Should not create a new user entity if email is invalid', () => {
		expect(() =>
			User.create({
				email: 'emailinvalid.com',
				password: 'password',
				username: 'username',
			})
		).toThrow()
	})
})
