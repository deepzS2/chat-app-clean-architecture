import { User } from '@entities/user'
import { UsersRepository } from '@repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
	public users: User[] = []

	async create(user: User): Promise<void> {
		this.users.push(user)
	}

	async getAll(): Promise<User[]> {
		return this.users
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.users.find((user) => user.email === email)

		if (!user) return null

		return user
	}

	async findById(id: string): Promise<User | null> {
		const user = this.users.find((user) => user.id === id)

		if (!user) return null

		return user
	}

	async update(id: string, user: Partial<User>): Promise<void> {
		const userIndex = this.users.findIndex((u) => u.id === id)

		if (userIndex === -1) throw new Error('User not found...')

		this.users[userIndex].update(user)
	}

	async delete(id: string): Promise<void> {
		const userIndex = this.users.findIndex((u) => u.id === id)

		if (userIndex === -1) throw new Error('User not found...')

		this.users.splice(userIndex, 1)
	}
}
