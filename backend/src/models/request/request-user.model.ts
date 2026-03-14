import { Request } from 'express';
import { UserResponse } from '../users/user-response.model';

export type RequestWithUser = Request & { user: UserResponse };
