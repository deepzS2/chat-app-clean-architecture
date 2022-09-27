import http from 'http'
import mongoose from 'mongoose'
import { Server } from 'socket.io'

import Application from './application'
import { CORS_OPTIONS, HOST, MONGODB_URL, PORT } from './config'
import { logger } from './shared/loggers'

async function bootstrap() {
	await mongoose.connect(MONGODB_URL)

	const app = new Application()
	const server = http.createServer(app.instance)

	await app.registerWebSocket(
		new Server(server, {
			cors: CORS_OPTIONS,
		})
	)
	app.registerControllers()

	server.listen(PORT, HOST)

	logger.info(`Running on http://${HOST}:${PORT}`)
}

bootstrap()
