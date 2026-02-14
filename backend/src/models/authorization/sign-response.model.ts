export type SignResponseStatus = 'OK' | 'Error';

export type SignResponse = {
    token?: string;
    code?: string;
    status?: SignResponseStatus;
    expiresIn?: number;
};
