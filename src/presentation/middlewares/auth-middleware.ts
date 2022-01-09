import {AccessDeniedError} from "../errors"
import {forbiddenError} from "../helpers/http/http-helper"
import {HttpRequest, HttpResponse, Middleware} from "../protocols"

export class AuthMiddleware implements Middleware {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        httpRequest

        const error = forbiddenError(new AccessDeniedError())

        return new Promise((resolve) => resolve(error))
    }
}
