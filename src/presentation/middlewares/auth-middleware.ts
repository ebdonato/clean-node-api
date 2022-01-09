import {LoadAccountByToken} from "../../domain/use-cases/load-account-by-token"
import {AccessDeniedError} from "../errors"
import {forbiddenError, okResponse} from "../helpers/http/http-helper"
import {HttpRequest, HttpResponse, Middleware} from "../protocols"

export class AuthMiddleware implements Middleware {
    constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const accessToken = httpRequest.headers?.["x-access-token"]

        if (accessToken) {
            const account = await this.loadAccountByToken.load(accessToken)

            if (account) {
                return okResponse({accountID: account.id})
            }
        }

        return forbiddenError(new AccessDeniedError())
    }
}
