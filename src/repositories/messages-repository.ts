import { BaseRepository } from '@core/base-repository'
import { Message, MessageProps } from '@entities/message'

export interface MessagesRepository extends BaseRepository<Message> {
	getAllOrdered(
		key: keyof MessageProps,
		orderBy: 'asc' | 'desc',
		options: {
			page: number
			limitPerPage: number
		}
	): Promise<Message[]>
}
