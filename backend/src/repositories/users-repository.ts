import { BaseRepository } from '@core/base-repository'
import { User } from '@entities/user'

export interface UsersRepository extends BaseRepository<User> {
	findByEmail(email: string): Promise<User | null>
}
