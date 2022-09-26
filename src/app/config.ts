import { CorsOptions } from 'cors'
import 'dotenv/config'

export const PORT = process.env.PORT ?? 3000
export const MONGODB_URL = process.env.MONGODB_URL ?? ''
export const SECRET = process.env.SECRET ?? 'SECRET'
export const TTL = process.env.SECRET ?? '7d'

export const CORS_OPTIONS: CorsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
