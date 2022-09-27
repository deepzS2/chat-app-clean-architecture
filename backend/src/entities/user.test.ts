import { it, describe, expect } from 'vitest'

import { User } from './user'

describe('User entity', () => {
	it('Should create a new user entity, hash password and generate an UUID', () => {
		const entity = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		})

		expect(entity.isSuccess).toBeTruthy()
		expect(entity.getValue()).toBeInstanceOf(User)
		expect(entity.getValue().password).not.toBe('password')
	})

	it('Should not create a new user entity if email is invalid', () => {
		const entity = User.create({
			email: 'email-invalid@.com',
			password: 'password',
			username: 'username',
		})

		expect(entity.isFailure).toBeTruthy()
		expect(entity.getValue().email).not.toBeNull()
	})
})
