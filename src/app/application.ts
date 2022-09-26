import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { Server } from 'socket.io'

import { MessagesRepository } from '@repositories/messages-repository'
import { MongoDbMessagesRepository } from '@repositories/mongodb/mongodb-messages-repository'
import { MongoDbUsersRepository } from '@repositories/mongodb/mongodb-users-repository'
import { UsersRepository } from '@repositories/users-repository'
import { JsonWebToken } from '@shared'
import { authorize } from '@thream/socketio-jwt'

import { CORS_OPTIONS, SECRET, TTL } from './config'
import { MessagesController } from './controllers/messages-controller'
import { UsersController } from './controllers/users-controller'
import { onConnection } from './events/connection'

export default class Application {
	public readonly instance = express()

	private io!: Server

	private usersRepository!: UsersRepository
	private messagesRepository!: MessagesRepository
	private jsonWebToken!: JsonWebToken

	constructor() {
		this.setup()
		this.registerServices()
	}

	async registerWebSocket(io: Server) {
		this.io = io

		this.io.use(
			authorize({
				secret: SECRET,
				onAuthentication: async (decodedToken) => {
					const user = await this.usersRepository.findById(decodedToken.id)

					return user
				},
			})
		)

		this.io.on('connection', (socket) => onConnection(this.io, socket))
	}

	registerControllers() {
		const usersController = new UsersController(
			this.usersRepository,
			this.jsonWebToken
		)
		const messagesController = new MessagesController(
			this.io,
			this.messagesRepository,
			this.usersRepository,
			this.jsonWebToken
		)

		// Register controllers
		this.instance.use('/users', usersController.router)
		this.instance.use('/messages', messagesController.router)
	}

	private setup() {
		// URLEncoded and JSON
		this.instance.use(express.urlencoded({ extended: true }))
		this.instance.use(express.json())

		// Helmet and CORS
		this.instance.use(helmet())
		this.instance.use(cors(CORS_OPTIONS))
	}

	private registerServices() {
		// Repository and services
		this.usersRepository = new MongoDbUsersRepository()
		this.messagesRepository = new MongoDbMessagesRepository()
		this.jsonWebToken = new JsonWebToken(SECRET, TTL)
	}
}
