import {SignUpController} from "../../../../presentation/controllers/signup/signup-controller"
import {Controller} from "../../../../presentation/protocols"
import {makeDbAuthentication} from "../../use-cases/authentication/db-authentication-factory"
import {makeDbAddAccount} from "../../use-cases/db-add-account/db-add-account-factory"
import {makeLogControllerDecorator} from "../decorators/log-controller-decorator-factory"
import {makeSignupValidation} from "./signup-validation-factory"

export const makeSignupController = (): Controller => {
    const signUpController = new SignUpController(makeDbAddAccount(), makeSignupValidation(), makeDbAuthentication())

    return makeLogControllerDecorator(signUpController)
}
