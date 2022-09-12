import { Message } from '@entities/message'

export interface MessagesRepository {
	create(message: Message): Promise<void>
	getAll(): Promise<Message[]>
	findById(id: string): Promise<Message | null>
	update(id: string, message: Partial<Message>): Promise<void>
	delete(id: string): Promise<void>
}
