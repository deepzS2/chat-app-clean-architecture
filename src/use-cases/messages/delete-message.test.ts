import { it, describe, expect, beforeEach } from 'vitest'

import { Message } from '@entities/message'
import { User } from '@entities/user'
import { InMemoryMessagesRepository } from '@repositories/in-memory/in-memory-messages-repository'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'

import { DeleteMessage } from './delete-message'
import { MessageNotFound, UnauthorizedOwner } from './errors'

describe('Delete message', () => {
	const messagesRepository = new InMemoryMessagesRepository()
	const usersRepository = new InMemoryUsersRepository()
	let message: Message
	let user: User

	beforeEach(async () => {
		user = User.create({
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

	it('Should delete a message', async () => {
		const deleteMessage = new DeleteMessage(messagesRepository)

		const result = await deleteMessage.execute({
			id: message.id,
			userId: user.id,
		})

		expect(result.isRight()).toBeTruthy()
	})

	it('Should return not authorized if not the owner of the message', async () => {
		const updateMessage = new DeleteMessage(messagesRepository)

		const result = await updateMessage.execute({
			id: message.id,
			userId: '000000',
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(UnauthorizedOwner)
	})

	it("Should return error if message don't exists", async () => {
		const updateMessage = new DeleteMessage(messagesRepository)

		const result = await updateMessage.execute({
			id: '000000',
			userId: user.id,
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(MessageNotFound)
	})
})
