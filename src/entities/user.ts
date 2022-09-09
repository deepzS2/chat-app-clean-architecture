import bcrypt from 'bcrypt'
import { validate as validateEmail } from 'email-validator'
import { v4 as uuid } from 'uuid'

interface UserProps {
	id?: string
	username: string
	email: string
	password: string
}

export class User {
	private static readonly SALT_ROUND = 10

	private constructor(private props: UserProps) {}

	get id() {
		return this.props.id!
	}

	get username() {
		return this.props.username
	}

	get email() {
		return this.props.email
	}

	get password() {
		return this.props.password
	}

	update(propsToUpdate: Partial<Omit<UserProps, 'id'>>) {
		if (propsToUpdate.email && !validateEmail(propsToUpdate.email))
			throw new Error('Invalid email!')

		this.props = Object.assign(this.props, propsToUpdate)
	}

	private static hash(data: string) {
		const salt = bcrypt.genSaltSync(this.SALT_ROUND)

		return bcrypt.hashSync(data, salt)
	}

	static create(props: UserProps) {
		if (!validateEmail(props.email)) throw new Error('Invalid email!')

		return new User({
			...props,
			id: props.id || uuid(),
			password: this.hash(props.password),
		})
	}
}
