import {
    Controller,
    HttpRequest,
    HttpResponse,
    AddAccount,
    Authentication,
    Validation,
} from "./signup-controller-protocols"
import {EmailInUseError} from "@/presentation/errors"
import {badRequest, forbiddenError, okResponse, serverError} from "@/presentation/helpers/http/http-helper"

export class SignUpController implements Controller {
    constructor(
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)

            if (error) {
                return badRequest(error)
            }

            const {name, email, password} = httpRequest.body

            const account = await this.addAccount.add({
                name,
                email,
                password,
            })

            if (!account) {
                return forbiddenError(new EmailInUseError())
            }

            const accessToken = await this.authentication.auth({email, password})

            return okResponse({accessToken})
        } catch (error) {
            return serverError(error as Error)
        }
    }
}
