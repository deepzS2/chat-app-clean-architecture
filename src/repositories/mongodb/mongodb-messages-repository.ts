import { Model, model, Schema, Types } from 'mongoose'

import { Message, MessageProps } from '@entities/message'
import { User, UserProps } from '@entities/user'
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
			authorId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
		})

		this.model = model<MessageSchemaProps>('Messages', messageSchema)
	}

	async create(message: Message): Promise<void> {
		await this.model.create({
			content: message.content,
			authorId: message.authorId,
		})
	}

	async getAll(): Promise<Message[]> {
		const results = await this.model.find()

		return results.map((result) =>
			Message.fromModel({
				...result.toObject(),
				authorId: result.authorId!.toString(),
				id: result._id.toString(),
			})
		)
	}

	async getAllOrdered(
		key: keyof MessageProps,
		orderBy: 'asc' | 'desc',
		options: { page: number; limitPerPage: number }
	): Promise<Message[]> {
		const results = await this.model
			.find()
			.populate<{ authorId: UserProps & { _id: Types.ObjectId } }>('authorId')
			.limit(options.limitPerPage)
			.skip(options.limitPerPage * (options.page - 1))
			.sort({
				[key]: orderBy,
			})

		return results.map((result) =>
			Message.fromModel({
				...result.toObject(),
				authorId: result.authorId!._id.toString(),
				author: User.fromModel(result.authorId!),
			})
		)
	}

	async findById(id: string): Promise<Message | null> {
		try {
			const result = await this.model.findById(id)

			if (!result) return null

			return Message.fromModel({
				...result.toObject(),
				authorId: result.authorId.toString(),
				id: result._id.toString(),
			})
		} catch (error) {
			return null
		}
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
