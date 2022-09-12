import { Message } from '@entities/message'
import { MessagesRepository } from '@repositories/messages-repository'

export class InMemoryMessagesRepository implements MessagesRepository {
	public messages: Array<Message> = []

	async create(message: Message): Promise<void> {
		this.messages.push(message)
	}

	async getAll(): Promise<Message[]> {
		return this.messages
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
