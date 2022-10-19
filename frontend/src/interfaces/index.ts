// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
	id: string
	username: string
	email: string
}

export type Message = {
	id: string
	content: string
	authorId: string
	author: User
	createdAt: string
}
