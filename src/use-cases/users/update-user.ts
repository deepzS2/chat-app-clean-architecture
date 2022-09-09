import { User } from '@entities/user'
import { UsersRepository } from '@repositories/users-repository'
import { Either, left, Result, right } from '@shared'

import { InvalidRequestParams, UserNotFound } from './errors'

interface UpdateUserRequest {
	id: string
	data: Partial<User>
}

type UpdateUserResponse = Either<
	UserNotFound | InvalidRequestParams,
	Result<User>
>

export class UpdateUser {
	constructor(private readonly userRepository: UsersRepository) {}

	async execute({ data, id }: UpdateUserRequest): Promise<UpdateUserResponse> {
		if (!id) return left(InvalidRequestParams.create('id'))

		const user = await this.userRepository.findById(id)

		if (!user) return left(UserNotFound.createById(id))

		await this.userRepository.update(id, data)

		return right(Result.ok(user))
	}
}
