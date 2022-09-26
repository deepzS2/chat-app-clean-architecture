import http from 'http'
import mongoose from 'mongoose'
import { Server } from 'socket.io'

import Application from './application'
import { CORS_OPTIONS, MONGODB_URL, PORT } from './config'

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

	server.listen(PORT, () => {
		console.log(`http://localhost:${PORT}`)
	})
}

bootstrap()
