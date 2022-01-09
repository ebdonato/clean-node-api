import {LoadAccountByToken} from "../../domain/use-cases/load-account-by-token"
import {AccessDeniedError} from "../errors"
import {forbiddenError} from "../helpers/http/http-helper"
import {HttpRequest, HttpResponse, Middleware} from "../protocols"

export class AuthMiddleware implements Middleware {
    constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const accessToken = httpRequest.headers?.["x-access-token"]

        accessToken && (await this.loadAccountByToken.load(accessToken))

        return forbiddenError(new AccessDeniedError())
    }
}
