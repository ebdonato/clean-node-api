import {InvalidParamError, MissingParamError} from "../../errors"
import {badRequest, okResponse, serverError, unauthorizedError} from "../../helpers/http-helper"
import {Controller, EmailValidator, HttpRequest, HttpResponse, Authentication} from "./login-protocols"

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator

    private readonly authentication: Authentication

    constructor(emailValidator: EmailValidator, authentication: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredFields = ["email", "password"]

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const {email, password} = httpRequest.body

            if (!this.emailValidator.isValid(email)) {
                return badRequest(new InvalidParamError("email"))
            }

            const accessToken = await this.authentication.auth(email, password)

            if (!accessToken) return unauthorizedError()

            return okResponse({accessToken})
        } catch (error) {
            return serverError(error as Error)
        }
    }
}
