// src/utils/HttpError.ts
export class HttpError extends Error {
  statusCode: number;
  info?: any;
  responseBody?: any;

  constructor(message: string, statusCode: number, info?: any, responseBody?: any) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.info = info; 
    this.responseBody = responseBody;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}