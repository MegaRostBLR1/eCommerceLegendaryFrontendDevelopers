export class HttpException extends Error {
    public status: number;
    public message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }

    static badRequest(message?: string) {
        return new HttpException(400, `Bad request${message ? ', ' + message : ''}`);
    }

    static unauthorized(message?: string) {
        return new HttpException(401, message || 'Unauthorized');
    }

    static forbidden(message: string | unknown) {
        return new HttpException(403, (message as string) || 'Forbidden');
    }

    static internalError(message?: string | unknown) {
        return new HttpException(500, message ? `Internal Server Error: ${message}` : 'Internal Server Error');
    }
}
