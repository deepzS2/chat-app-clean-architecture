import { it, describe, expect, beforeEach } from 'vitest'

import { Message } from '@entities/message'
import { User } from '@entities/user'
import { InMemoryMessagesRepository } from '@repositories/in-memory/in-memory-messages-repository'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'
import { Result } from '@shared'

import { MessageDTO } from './dto/message-dto'
import { MessageNotFound, UnauthorizedOwner } from './errors'
import { UpdateMessage } from './update-message'

describe('Update message', () => {
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

	it('Should update a message', async () => {
		const updateMessage = new UpdateMessage(messagesRepository)

		const result = await updateMessage.execute({
			id: message.id,
			content: 'New content',
			userId: user.id,
		})

		expect(result.isRight()).toBeTruthy()
		expect(result.value).toBeInstanceOf(Result<MessageDTO>)

		const messageDto = result.value.getValue() as MessageDTO
		expect(messageDto.content).toEqual('New content')
	})

	it('Should return not authorized if not the owner of the message', async () => {
		const updateMessage = new UpdateMessage(messagesRepository)

		const result = await updateMessage.execute({
			id: message.id,
			content: 'New content',
			userId: '000000',
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(UnauthorizedOwner)
	})

	it("Should return error if message don't exists", async () => {
		const updateMessage = new UpdateMessage(messagesRepository)

		const result = await updateMessage.execute({
			id: '000000',
			content: 'New content',
			userId: user.id,
		})

		expect(result.isLeft()).toBeTruthy()
		expect(result.value).toBeInstanceOf(MessageNotFound)
	})
})
