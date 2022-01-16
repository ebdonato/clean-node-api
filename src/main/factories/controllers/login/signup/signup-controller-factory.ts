import {makeSignupValidation} from "./signup-validation-factory"
import {makeDbAuthentication} from "@/main/factories/use-cases/account/authentication/db-authentication-factory"
import {makeDbAddAccount} from "@/main/factories/use-cases/account/add-account/db-add-account-factory"
import {makeLogControllerDecorator} from "@/main/factories/decorators/log-controller-decorator-factory"
import {SignUpController} from "@/presentation/controllers/login/signup/signup-controller"
import {Controller} from "@/presentation/protocols"

export const makeSignupController = (): Controller => {
    const signUpController = new SignUpController(makeDbAddAccount(), makeSignupValidation(), makeDbAuthentication())

    return makeLogControllerDecorator(signUpController)
}
