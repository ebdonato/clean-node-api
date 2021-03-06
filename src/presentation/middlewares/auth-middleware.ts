import {HttpRequest, HttpResponse, Middleware, LoadAccountByToken} from "./auth-middleware-protocols"
import {AccessDeniedError} from "@/presentation/errors"
import {forbiddenError, okResponse, serverError} from "@/presentation/helpers/http/http-helper"

export class AuthMiddleware implements Middleware {
    constructor(private readonly loadAccountByToken: LoadAccountByToken, private readonly role?: string) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const accessToken = httpRequest.headers?.["x-access-token"]

            if (accessToken) {
                const account = await this.loadAccountByToken.load(accessToken, this.role)

                if (account) {
                    return okResponse({accountID: account.id})
                }
            }

            return forbiddenError(new AccessDeniedError())
        } catch (error) {
            return serverError(error as Error)
        }
    }
}
