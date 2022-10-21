import http from 'http'
import mongoose from 'mongoose'

import Application from './application'
import { HOST, MONGODB_URL, PORT } from './config'
import { logger } from './shared/loggers'

async function bootstrap() {
	await mongoose.connect(MONGODB_URL)

	const app = new Application()
	const server = http.createServer(app.instance)

	app.registerWebSocket(server)
	app.registerControllers()

	server.listen(PORT, HOST, () => {
		logger.info(`Running on http://${HOST}:${PORT}`)
	})
}

bootstrap()
