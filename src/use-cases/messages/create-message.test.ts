import { v4 as uuid } from 'uuid'
import { describe, expect, it } from 'vitest'

import { Message } from '@entities/message'
import { User } from '@entities/user'
import { InMemoryMessagesRepository } from '@repositories/in-memory/in-memory-messages-repository'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'

import { CreateMessage } from './create-message'
import { AuthorInvalid, InvalidMessageProps } from './errors'

describe('Create message', () => {
	it('Should create a new message', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const messagesRepository = new InMemoryMessagesRepository()
		const createMessage = new CreateMessage(usersRepository, messagesRepository)

		const user = User.create({
			email: 'test@test.com',
			password: '123456',
			username: 'test',
		}).getValue()
		await usersRepository.create(user)

		const result = await createMessage.execute({
			authorId: user.id,
			content: 'Hello world!',
		})

		expect(result.isRight()).toBeTruthy()
		expect(result.value.getValue()).toBeInstanceOf(Message)
	})

	it("Should not create a new message if user don't exists", async () => {
		const usersRepository = new InMemoryUsersRepository()
		const messagesRepository = new InMemoryMessagesRepository()
		const createMessage = new CreateMessage(usersRepository, messagesRepository)

		const result = await createMessage.execute({
			authorId: uuid(),
			content: 'Hello world!',
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(AuthorInvalid)
	})

	it('Should not create a new message if no content provided', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const messagesRepository = new InMemoryMessagesRepository()
		const createMessage = new CreateMessage(usersRepository, messagesRepository)

		const user = User.create({
			email: 'test@test.com',
			password: '123456',
			username: 'test',
		}).getValue()
		await usersRepository.create(user)

		const result = await createMessage.execute({
			authorId: user.id,
			content: '',
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(InvalidMessageProps)
	})
})
