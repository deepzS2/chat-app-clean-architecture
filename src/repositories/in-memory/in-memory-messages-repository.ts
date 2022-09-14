import { Message, MessageProps } from '@entities/message'
import { User } from '@entities/user'
import { MessagesRepository } from '@repositories/messages-repository'

export class InMemoryMessagesRepository implements MessagesRepository {
	public messages: Array<Message> = []

	async create(message: Message): Promise<void> {
		this.messages.push(message)
	}

	async getAll(): Promise<Message[]> {
		return this.messages
	}

	async getAllOrdered(
		key: keyof MessageProps,
		orderBy: 'asc' | 'desc',
		options: { page: number; limitPerPage: number }
	): Promise<Message[]> {
		const startSlice = options.limitPerPage * (options.page - 1)
		const endSlice = options.limitPerPage * options.page

		if (startSlice > this.messages.length) return []

		const sortMultiplier = orderBy === 'asc' ? 1 : -1
		const page = this.messages.slice(startSlice, endSlice)

		return page.sort((a, b) => {
			let aKey: string | number | Date | User = a[key]
			let bKey: string | number | Date | User = b[key]

			if (aKey instanceof User || bKey instanceof User) return 0
			if (aKey instanceof Date && bKey instanceof Date) {
				aKey = aKey.getTime()
				bKey = bKey.getTime()
			}

			if (aKey > bKey) return 1 * sortMultiplier
			if (aKey < bKey) return -1 * sortMultiplier
			return 0
		})
	}

	async findById(id: string): Promise<Message | null> {
		const message = this.messages.find((m) => m.id === id)

		if (!message) return null

		return message
	}

	async update(id: string, message: Partial<Message>): Promise<void> {
		const messageIndex = this.messages.findIndex((m) => m.id === id)

		if (messageIndex === -1) throw new Error('Message not found...')

		this.messages[messageIndex].update(message)
	}

	async delete(id: string): Promise<void> {
		const messageIndex = this.messages.findIndex((u) => u.id === id)

		if (messageIndex === -1) throw new Error('Message not found...')

		this.messages.splice(messageIndex, 1)
	}
}
