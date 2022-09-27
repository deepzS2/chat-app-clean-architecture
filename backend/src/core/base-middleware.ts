import { NextFunction, Request, Response } from 'express'

export interface BaseMiddleware {
	handle(req: Request, res: Response, next: NextFunction): Promise<any>
}
