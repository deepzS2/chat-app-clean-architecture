import { it, describe, expect, beforeEach } from 'vitest'

import { Message } from '@entities/message'
import { User } from '@entities/user'
import { InMemoryMessagesRepository } from '@repositories/in-memory/in-memory-messages-repository'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'
import { Result } from '@shared'

import { MessageDTO } from './dto/message-dto'
import { AuthorInvalid, MessageNotFound } from './errors'
import { GetMessage } from './get-message'

describe('Get messages', () => {
	const messagesRepository = new InMemoryMessagesRepository()
	const usersRepository = new InMemoryUsersRepository()
	let message: Message

	beforeEach(async () => {
		const user = User.create({
			email: 'test@test.com',
			username: 'username',
			password: 'password',
		}).getValue()

		await usersRepository.create(user)

		message = Message.create({
			authorId: user.id,
			content: 'Hello',
		}).getValue()
		await messagesRepository.create(message)
	})

	it('Should get the message created', async () => {
		const getMessage = new GetMessage(messagesRepository, usersRepository)

		const result = await getMessage.execute({
			id: message.id,
		})

		expect(result.isRight()).toBeTruthy()
		expect(result.value).toBeInstanceOf(Result<MessageDTO>)
	})

	it('Should return error if message not found', async () => {
		const getMessage = new GetMessage(messagesRepository, usersRepository)

		const result = await getMessage.execute({
			id: `idinvalid`,
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(MessageNotFound)
	})

	it("Should return error if author don't exists anymore", async () => {
		const getMessage = new GetMessage(messagesRepository, usersRepository)

		await usersRepository.delete(message.authorId)

		const result = await getMessage.execute({
			id: message.id,
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(AuthorInvalid)
	})
})
