import { it, describe, expect } from 'vitest'

import { Message } from '@entities/message'
import { User } from '@entities/user'
import { InMemoryMessagesRepository } from '@repositories/in-memory/in-memory-messages-repository'

import { GetMessages } from './get-messages'

describe('Get messages', () => {
	it('Should return all messages', async () => {
		const repository = new InMemoryMessagesRepository()
		const getMessages = new GetMessages(repository)

		const user = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		}).getValue()
		const message = Message.create({
			authorId: user.id,
			content: 'Hello world!',
			author: user,
		}).getValue()
		await repository.create(message)

		const result = await getMessages.execute()
		const array = result.getValue()

		expect(array.length).toBe(1)
		expect(array).toEqual(expect.arrayContaining([message]))
	})

	it('Should return an empty array if no messages registered yet', async () => {
		const repository = new InMemoryMessagesRepository()
		const getMessages = new GetMessages(repository)

		const result = await getMessages.execute()
		const array = result.getValue()

		expect(array.length).toBe(0)
	})
})
