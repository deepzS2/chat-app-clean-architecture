import { User } from '@entities/user'

export interface UsersRepository {
	create(user: User): Promise<void>
	getAll(): Promise<User[]>
	findById(id: string): Promise<User | null>
	findByEmail(email: string): Promise<User | null>
	update(id: string, user: Partial<User>): Promise<void>
	delete(id: string): Promise<void>
}
