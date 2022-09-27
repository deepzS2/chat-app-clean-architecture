import { NextFunction, Request, Response, Router } from 'express'

export interface BaseControllerInterface {
	getAll(req: Request, res: Response, next: NextFunction): Promise<any>
	getOne(req: Request, res: Response, next: NextFunction): Promise<any>
	create(req: Request, res: Response, next: NextFunction): Promise<any>
	update(req: Request, res: Response, next: NextFunction): Promise<any>
	delete(req: Request, res: Response, next: NextFunction): Promise<any>
}

export abstract class BaseController {
	public readonly router = Router()

	abstract getAll(req: Request, res: Response, next: NextFunction): Promise<any>
	abstract getOne(req: Request, res: Response, next: NextFunction): Promise<any>
	abstract create(req: Request, res: Response, next: NextFunction): Promise<any>
	abstract update(req: Request, res: Response, next: NextFunction): Promise<any>
	abstract delete(req: Request, res: Response, next: NextFunction): Promise<any>
}
