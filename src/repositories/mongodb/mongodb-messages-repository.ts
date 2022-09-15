import { Model, model, Schema, Types } from 'mongoose'

import { Message, MessageProps } from '@entities/message'
import { MessagesRepository } from '@repositories/messages-repository'

type MessageSchemaProps = Omit<MessageProps, 'authorId'> & {
	authorId: Types.ObjectId
}

export class MongoDbMessagesRepository implements MessagesRepository {
	private readonly model: Model<MessageSchemaProps, object, object, object, any>

	constructor() {
		const messageSchema = new Schema<MessageSchemaProps>({
			content: { type: String, required: true },
			createdAt: { type: Date, default: Date.now },
			authorId: { type: Schema.Types.ObjectId, required: true },
		})

		this.model = model<MessageSchemaProps>('Messages', messageSchema)
	}

	private toMessageEntity(id: Types.ObjectId, props: MessageSchemaProps) {
		return Message.create({
			...props,
			authorId: props.authorId.toString(),
			id: id.toString(),
		}).getValue()
	}

	async create(message: Message): Promise<void> {
		await this.model.create({
			...message,
		})
	}

	async getAll(): Promise<Message[]> {
		const results = await this.model.find()

		return results.map((result) => this.toMessageEntity(result._id, result))
	}

	async getAllOrdered(
		key: keyof MessageProps,
		orderBy: 'asc' | 'desc',
		options: { page: number; limitPerPage: number }
	): Promise<Message[]> {
		const results = await this.model
			.find()
			.limit(options.limitPerPage)
			.skip(options.limitPerPage * (options.page - 1))
			.sort({
				[key]: orderBy,
			})

		return results.map((result) => this.toMessageEntity(result._id, result))
	}

	async findById(id: string): Promise<Message | null> {
		const result = await this.model.findById(id)

		if (!result) return null

		return this.toMessageEntity(result._id, result)
	}

	async update(id: string, entity: Partial<Message>): Promise<void> {
		await this.model.findByIdAndUpdate(id, {
			$set: {
				content: entity.content,
			},
		})
	}

	async delete(id: string): Promise<void> {
		await this.model.findByIdAndDelete(id)
	}
}
