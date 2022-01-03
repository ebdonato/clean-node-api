import {LoginController} from "../../../../presentation/controllers/login/login/login-controller"
import {Controller} from "../../../../presentation/protocols"
import {makeDbAuthentication} from "../../use-cases/authentication/db-authentication-factory"
import {makeLogControllerDecorator} from "../../decorators/log-controller-decorator-factory"
import {makeLoginValidation} from "./login-validation-factory"

export const makeLoginController = (): Controller => {
    const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())

    return makeLogControllerDecorator(loginController)
}
