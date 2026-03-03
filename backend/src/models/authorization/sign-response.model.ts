export type SignResponseStatus = 'OK' | 'Error';

export type SignResponse = {
    token?: string;
    code?: number;
    status?: SignResponseStatus;
    expiresIn?: number;
};
