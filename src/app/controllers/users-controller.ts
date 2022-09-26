import { NextFunction, Request, Response } from 'express'

import { BaseController } from '@core/base-controller'
import { UsersRepository } from '@repositories/users-repository'
import { JsonWebToken } from '@shared'
import { CreateUser } from '@use-cases/users/create-user'
import { UserNotFound } from '@use-cases/users/errors'
import { GetUser } from '@use-cases/users/get-user'
import { GetUsers } from '@use-cases/users/get-users'
import { LoginUser } from '@use-cases/users/login-user'
import { UpdateUser } from '@use-cases/users/update-user'

export class UsersController extends BaseController {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly jwt: JsonWebToken
	) {
		super()

		this.router.get('/', this.getAll.bind(this))
		this.router.get('/:id', this.getOne.bind(this))
		this.router.post('/', this.create.bind(this))
		this.router.post('/login', this.login.bind(this))
		this.router.put('/:id', this.update.bind(this))
		this.router.delete('/:id', this.delete.bind(this))
	}

	async getAll(_req: Request, res: Response) {
		const getUsers = new GetUsers(this.usersRepository)

		const result = await getUsers.execute()

		if (result.isFailure) return res.status(500).send(result.getValue())

		return res.send(result.getValue())
	}

	async getOne(req: Request, res: Response) {
		const getUser = new GetUser(this.usersRepository)

		const result = await getUser.execute({
			id: req.params.id,
		})

		if (result.isLeft()) {
			return res
				.status(result.value instanceof UserNotFound ? 404 : 400)
				.send(result.value.getValue())
		}

		return res.send(result.value.getValue())
	}

	async login(req: Request, res: Response): Promise<any> {
		const loginUser = new LoginUser(this.usersRepository, this.jwt)

		const result = await loginUser.execute({
			email: req.body.email,
			password: req.body.password,
		})

		if (result.isLeft()) {
			return res.status(400).send(result.value.getValue())
		}

		return res.send(result.value.getValue())
	}

	async create(req: Request, res: Response): Promise<any> {
		const createUser = new CreateUser(this.usersRepository)

		const result = await createUser.execute({
			email: req.body.email,
			password: req.body.password,
			username: req.body.username,
		})

		if (result.isLeft()) {
			return res.status(400).send(result.value.getValue())
		}

		return res.status(201).send()
	}

	async update(req: Request, res: Response, next: NextFunction) {
		const updateUser = new UpdateUser(this.usersRepository)

		const result = await updateUser.execute({
			data: {
				username: req.body.username,
			},
			id: req.user!.id,
		})

		if (result.isLeft()) {
			const response = result.value
			return res
				.status(response instanceof UserNotFound ? 404 : 400)
				.send(response.getValue())
		}

		return res.status(200).send(result.value.getValue())
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		throw new Error('Method not implemented')
	}
}
