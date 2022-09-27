import { UserProps } from '@entities/user'

declare module 'express' {
	interface Request {
		user?: {
			id: NonNullable<UserProps['id']>
			email: UserProps['email']
			username: UserProps['username']
		}
	}
}
