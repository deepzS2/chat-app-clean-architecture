import { Model, model, Schema } from 'mongoose'

import { User, UserProps } from '@entities/user'
import { UsersRepository } from '@repositories/users-repository'

export class MongoDbUsersRepository implements UsersRepository {
	private readonly model: Model<UserProps, object, object, object, any>

	constructor() {
		const userSchema = new Schema<UserProps>({
			email: { type: String, required: true, unique: true },
			password: { type: String, required: true },
			username: { type: String, required: true },
		})

		this.model = model<UserProps>('Users', userSchema)
	}

	async findByEmail(email: string): Promise<User | null> {
		const result = await this.model.findOne({
			email,
		})

		if (!result) return null

		return User.fromModel({
			...result.toObject(),
			id: result._id.toString(),
		})
	}

	async create(user: User): Promise<void> {
		await this.model.create({
			email: user.email,
			password: user.password,
			username: user.username,
		})
	}

	async getAll(): Promise<User[]> {
		const results = await this.model.find()

		return results.map((result) =>
			User.fromModel({
				...result.toObject(),
				id: result._id.toString(),
			})
		)
	}

	async findById(id: string): Promise<User | null> {
		const result = await this.model.findById(id)

		if (!result) return null

		return User.fromModel({
			...result.toObject(),
			id: result._id.toString(),
		})
	}

	async update(id: string, entity: Partial<User>): Promise<void> {
		await this.model.findByIdAndUpdate(id, {
			$set: {
				email: entity.email,
				password: entity.password,
				username: entity.username,
			},
		})
	}

	async delete(id: string): Promise<void> {
		await this.model.findByIdAndDelete(id)
	}
}
