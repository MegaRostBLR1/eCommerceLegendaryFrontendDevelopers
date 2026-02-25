const jwt = require('jsonwebtoken');
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { ConfigFactory } from '../config/config-factory';
import { UserRole } from '../enums/user-role.enum';
import { userService } from './user.service';
import { SignResponse } from '../models/authorization/sign-response.model';
import { DecodedToken } from '../models/authorization/decoded-token.model';
import { ReqBody } from '../models/common/request-body.model';
import { dbService } from './db/db.service';
import { USER_SELECT } from './db/constants/user.select';

const config = ConfigFactory();

const createToken = (email: string, role: UserRole, id: number): SignResponse => {
    const tokenLife = config.tokenLife;
    const expiresIn: number = new Date().getTime() + tokenLife * 1000;
    const token: string = jwt.sign(
        {
            email,
            role,
            id,
        },
        `${config.accessToken}`,
        { expiresIn: tokenLife },
    );

    return { token, expiresIn };
};

export const compareHashEssence = async (current: string, stored: string): Promise<boolean> => {
    return await bcrypt.compare(current, stored);
};

export const hashEssence = async (data: string): Promise<string> => {
    return await bcrypt.hash(data, 10);
};

export const authorizationService = {
    handleInnerToken: async (token: string): Promise<JwtPayload | boolean | DecodedToken> => {
        return new Promise((resolve, _reject) => {
            jwt.verify(token, `${config.accessToken}`, (error: any, decoded: JwtPayload) => {
                if (error) {
                    console.log(`ERROR HANDLE jwt, ${error}`);
                    resolve(false);
                } else {
                    resolve(decoded);
                }
            });
        });
    },

    signInSignUp: async (dto: ReqBody): Promise<SignResponse> => {
        const { password, email } = dto;
        let candidate = await userService.getCandidate(email, true, { ...USER_SELECT, password: true });

        if (candidate && !(await compareHashEssence(password, candidate.password || ''))) return { code: 401, status: 'Error' };

        if (!candidate)
            candidate = await dbService.createUser({
                password: await hashEssence(password),
                email,
            });

        return {
            status: 'OK',
            ...createToken(email, candidate?.role as UserRole, candidate?.id || 0),
        };
    },
};
