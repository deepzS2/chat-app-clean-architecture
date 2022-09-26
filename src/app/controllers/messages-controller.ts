import { Request, Response, NextFunction } from 'express'
import { Server } from 'socket.io'

import { BaseController } from '@core/base-controller'
import { MessageProps } from '@entities/message'
import { MessagesRepository } from '@repositories/messages-repository'
import { UsersRepository } from '@repositories/users-repository'
import { JsonWebToken } from '@shared'
import { CreateMessage } from '@use-cases/messages/create-message'
import { DeleteMessage } from '@use-cases/messages/delete-message'
import { MessageNotFound } from '@use-cases/messages/errors'
import { GetMessage } from '@use-cases/messages/get-message'
import { GetMessages } from '@use-cases/messages/get-messages'
import { UpdateMessage } from '@use-cases/messages/update-message'

import { AuthMiddleware } from '../middlewares/auth.middleware'

export class MessagesController extends BaseController {
	constructor(
		private readonly io: Server,
		private readonly messagesRepository: MessagesRepository,
		private readonly usersRepository: UsersRepository,
		jsonWebToken: JsonWebToken
	) {
		super()

		const authMiddleware = new AuthMiddleware(usersRepository, jsonWebToken)

		this.router.get(
			'/',
			authMiddleware.handle.bind(authMiddleware),
			this.getAll.bind(this)
		)
		this.router.get(
			'/:id',
			authMiddleware.handle.bind(authMiddleware),
			this.getOne.bind(this)
		)
		this.router.post(
			'/',
			authMiddleware.handle.bind(authMiddleware),
			this.create.bind(this)
		)
		this.router.put(
			'/:id',
			authMiddleware.handle.bind(authMiddleware),
			this.update.bind(this)
		)
		this.router.delete(
			'/:id',
			authMiddleware.handle.bind(authMiddleware),
			this.delete.bind(this)
		)
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		const page = Number(req.query.page)
		const limitPerPage = Number(req.query.limit)
		const order = req.query.order as keyof MessageProps
		const orderBy = req.query.orderBy as 'asc' | 'desc'

		const getAll = new GetMessages(this.messagesRepository)

		const result = await getAll.execute({
			page: isNaN(page) ? 1 : page,
			limitPerPage: isNaN(limitPerPage) ? 50 : limitPerPage,
			key: order,
			orderBy,
		})

		if (result.isFailure) return res.status(500).send(result.getValue())

		return res.send(result.getValue())
	}

	async getOne(req: Request, res: Response, next: NextFunction) {
		const getMessage = new GetMessage(
			this.messagesRepository,
			this.usersRepository
		)

		const result = await getMessage.execute({ id: req.params.id })

		if (result.isLeft()) {
			return res.status(404).send(result.value.getValue())
		}

		return res.send(result.value.getValue())
	}

	async create(req: Request, res: Response, next: NextFunction) {
		const createMessage = new CreateMessage(
			this.usersRepository,
			this.messagesRepository
		)

		const result = await createMessage.execute({
			content: req.body.content,
			authorId: req.user!.id,
		})

		if (result.isLeft()) {
			return res.status(400).send(result.value.getValue())
		}

		this.io.emit('MESSAGE_CREATED', result.value.getValue())

		return res.status(201).send()
	}

	async update(req: Request, res: Response, next: NextFunction) {
		const updateMessage = new UpdateMessage(this.messagesRepository)

		const result = await updateMessage.execute({
			content: req.body.content,
			id: req.params.id,
			userId: req.user!.id,
		})

		if (result.isLeft()) {
			const response = result.value
			return response instanceof MessageNotFound
				? res.status(404).send(response.getValue())
				: res.status(400).send(response.getValue())
		}

		return res.status(200).send(result.value.getValue())
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		const deleteMessage = new DeleteMessage(this.messagesRepository)

		const result = await deleteMessage.execute({
			id: req.params.id,
			userId: req.user!.id,
		})

		if (result.isLeft()) {
			const response = result.value
			return response instanceof MessageNotFound
				? res.status(404).send(response.getValue())
				: res.status(400).send(response.getValue())
		}

		return res.status(204).send()
	}
}
