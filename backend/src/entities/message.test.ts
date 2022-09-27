import { it, describe, expect } from 'vitest'

import { Message } from './message'
import { User } from './user'

describe('Message entity', () => {
	it('Should create a new message with the respective author', () => {
		const user = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		}).getValue()

		const entity = Message.create({
			authorId: user.id,
			content: 'Hello world!',
			author: user,
		})

		expect(entity.isSuccess).toBeTruthy()
		expect(entity.getValue()).toBeInstanceOf(Message)
		expect(entity.getValue().content).toBe('Hello world!')
		expect(entity.getValue().authorId).toBe(user.id)
	})
})
