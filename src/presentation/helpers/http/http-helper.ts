import {ServerError, UnauthorizedError} from "@/presentation/errors"
import {HttpResponse} from "@/presentation/protocols/http"

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error,
})

export const forbiddenError = (error: Error): HttpResponse => ({
    statusCode: 403,
    body: error,
})

export const serverError = (error: Error): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(error.stack),
})

export const okResponse = (data: any): HttpResponse => ({
    statusCode: 200,
    body: data,
})

export const noContentResponse = (): HttpResponse => ({
    statusCode: 204,
    body: null,
})

export const unauthorizedError = (): HttpResponse => ({
    statusCode: 401,
    body: new UnauthorizedError(),
})
