import {InvalidParamError} from "../errors/invalid-param-error"
import {MissingParamError} from "../errors/missing-param-error"
import {ServerError} from "../errors/server-error"
import {badRequest} from "../helpers/http-helper"
import {Controller} from "../protocols/controller"
import {EmailValidator} from "../protocols/emailValidator"
import {HttpRequest, HttpResponse} from "../protocols/http"

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ["name", "email", "password", "passwordConfirmation"]

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            if (!this.emailValidator.isValid(httpRequest.body.email)) {
                return badRequest(new InvalidParamError("email"))
            }

            return {
                statusCode: 201,
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: new ServerError(),
            }
        }
    }
}
