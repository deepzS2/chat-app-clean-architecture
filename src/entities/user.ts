import bcrypt from 'bcrypt'
import { validate as validateEmail } from 'email-validator'
import { v4 as uuid } from 'uuid'

import { Result } from '@shared'

export interface UserProps {
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

	comparePassword(password: string) {
		return bcrypt.compareSync(password, this.password)
	}

	private static hash(data: string) {
		const salt = bcrypt.genSaltSync(this.SALT_ROUND)

		return bcrypt.hashSync(data, salt)
	}

	static create(props: UserProps): Result<User> {
		if (!validateEmail(props.email)) {
			return Result.fail({
				email: `Email "${props.email}" is invalid`,
			})
		}

		if (!props.password) {
			return Result.fail({
				password: `Please provide a password`,
			})
		}

		if (!props.username) {
			return Result.fail({
				username: `Please provide a username`,
			})
		}

		return Result.ok(
			new User({
				...props,
				id: props.id || uuid(),
				password: this.hash(props.password),
			})
		)
	}
}
