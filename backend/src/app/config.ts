import { CorsOptions } from 'cors'
import 'dotenv/config'

export const HOST = process.env.HOST ?? '0.0.0.0'
export const PORT = Number(process.env.PORT) ?? 3000
export const ENV = process.env.NODE_ENV ?? 'development'
export const MONGODB_URL = process.env.MONGODB_URL ?? ''
export const SECRET = process.env.SECRET ?? 'SECRET'
export const TTL = process.env.TTL ?? '7d'

export const CORS_OPTIONS: CorsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
