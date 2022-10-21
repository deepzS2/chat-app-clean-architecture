import cors from 'cors'
import express, { ErrorRequestHandler, RequestHandler } from 'express'
import helmet from 'helmet'
import http from 'http'
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
import { AuthMiddleware } from './middlewares/auth.middleware'
import { expressErrorLogger, expressLogger } from './shared/loggers'

export default class Application {
	public readonly instance = express()

	private io!: Server

	private usersRepository!: UsersRepository
	private messagesRepository!: MessagesRepository
	private jsonWebToken!: JsonWebToken
	private authMiddleware!: AuthMiddleware

	constructor() {
		this.setup()
		this.registerServices()
	}

	registerWebSocket(http: http.Server) {
		const io = new Server(http, {
			cors: CORS_OPTIONS,
		})

		io.use(this.authMiddleware.websocketHandle.bind(this.authMiddleware))

		io.on('connection', (socket) => {
			onConnection(this.io, socket)
		})

		this.io = io
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
			this.jsonWebToken,
			this.authMiddleware
		)

		// Register controllers
		this.instance.use('/users', usersController.router)
		this.instance.use('/messages', messagesController.router)

		// Health check
		this.instance.get('/health', this.createHealthCheck())

		// Errors handlers
		this.instance.use(this.createErrorHandler())
	}

	private setup() {
		// URLEncoded and JSON
		this.instance.use(express.urlencoded({ extended: true }))
		this.instance.use(express.json())

		// Helmet and CORS
		this.instance.use(helmet())
		this.instance.use(cors(CORS_OPTIONS))

		// Logger
		this.instance.use(expressLogger)
	}

	private registerServices() {
		// Repository and services
		this.usersRepository = new MongoDbUsersRepository()
		this.messagesRepository = new MongoDbMessagesRepository()
		this.jsonWebToken = new JsonWebToken(SECRET, TTL)
		this.authMiddleware = new AuthMiddleware(
			this.usersRepository,
			this.jsonWebToken
		)
	}

	private createErrorHandler(): ErrorRequestHandler {
		return (err, req, res, next) => {
			expressErrorLogger(err, req, res, next)

			res.status(500).send(err)
		}
	}

	private createHealthCheck(): RequestHandler {
		return (_req, res, _next) => {
			const healthcheck = {
				uptime: process.uptime(),
				message: 'OK',
				timestamp: new Date().toISOString(),
			}

			try {
				res.send(healthcheck)
			} catch (error) {
				healthcheck['message'] = (error as Error).message
				res.status(503).send()
			}
		}
	}
}
