export interface BaseRepository<T> {
	create(user: T): Promise<void>
	getAll(): Promise<T[]>
	findById(id: string): Promise<T | null>
	update(id: string, entity: Partial<T>): Promise<void>
	delete(id: string): Promise<void>
}
