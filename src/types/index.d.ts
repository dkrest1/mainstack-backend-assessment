
import { NextFunction, Request, Response, Express } from 'express';
export interface _NextFunction extends NextFunction { }
export interface _Response extends Response { }
export interface _Request extends Request { user?: any;}