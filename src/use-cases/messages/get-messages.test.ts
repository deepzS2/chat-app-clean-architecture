import { it, describe, expect } from 'vitest'

import { Message } from '@entities/message'
import { User } from '@entities/user'
import { InMemoryMessagesRepository } from '@repositories/in-memory/in-memory-messages-repository'

import { MessageUseCaseDTO } from './dto/message-use-case-dto'
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

		const result = await getMessages.execute({})
		const array = result.getValue()

		expect(array.length).toBe(1)
		expect(array).toEqual(
			expect.arrayContaining([MessageUseCaseDTO.fromEntity(message)])
		)
	})

	it('Should return all messages sorted by date ascending', async () => {
		const repository = new InMemoryMessagesRepository()
		const getMessages = new GetMessages(repository)

		const user = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		}).getValue()
		const messageBefore = Message.create({
			authorId: user.id,
			content: 'Hello world!',
			author: user,
			createdAt: new Date(2022, 9, 13),
		}).getValue()
		const messageAfter = Message.create({
			authorId: user.id,
			content: 'Hello world!',
			author: user,
			createdAt: new Date(2022, 9, 14),
		}).getValue()
		await repository.create(messageBefore)
		await repository.create(messageAfter)

		const result = await getMessages.execute({
			key: 'createdAt',
			orderBy: 'asc',
		})
		const array = result.getValue()

		expect(array.length).toBe(2)
		expect(array[0].id).toBe(messageBefore.id)
	})

	it('Should return all messages sorted by date descending', async () => {
		const repository = new InMemoryMessagesRepository()
		const getMessages = new GetMessages(repository)

		const user = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		}).getValue()
		const messageBefore = Message.create({
			authorId: user.id,
			content: 'Hello world!',
			author: user,
			createdAt: new Date(2022, 9, 13),
		}).getValue()
		const messageAfter = Message.create({
			authorId: user.id,
			content: 'Hello world!',
			author: user,
			createdAt: new Date(2022, 9, 14),
		}).getValue()
		await repository.create(messageBefore)
		await repository.create(messageAfter)

		const result = await getMessages.execute({
			key: 'createdAt',
			orderBy: 'desc',
		})
		const array = result.getValue()

		expect(array.length).toBe(2)
		expect(array[0].id).toBe(messageAfter.id)
	})

	it('Should paginate the array correctly', async () => {
		const repository = new InMemoryMessagesRepository()
		const getMessages = new GetMessages(repository)

		const user = User.create({
			email: 'email@email.com',
			password: 'password',
			username: 'username',
		}).getValue()

		const messageCreationPromises = Array.from({ length: 5 }).map(async () => {
			const message = Message.create({
				authorId: user.id,
				content: 'Hello world!',
				author: user,
				createdAt: new Date(),
			}).getValue()

			await repository.create(message)

			return message
		})

		await Promise.all(messageCreationPromises)

		const result = await getMessages.execute({
			key: 'createdAt',
			orderBy: 'desc',
			limitPerPage: 2,
			page: 1,
		})
		const array = result.getValue()

		expect(array.length).toBe(2)

		const lastPageResult = await getMessages.execute({
			key: 'createdAt',
			orderBy: 'desc',
			limitPerPage: 2,
			page: 3,
		})
		const lastPageArray = lastPageResult.getValue()

		expect(lastPageArray.length).toBe(1)
	})

	it('Should return an empty array if no messages registered yet', async () => {
		const repository = new InMemoryMessagesRepository()
		const getMessages = new GetMessages(repository)

		const result = await getMessages.execute({})
		const array = result.getValue()

		expect(array.length).toBe(0)
	})
})
