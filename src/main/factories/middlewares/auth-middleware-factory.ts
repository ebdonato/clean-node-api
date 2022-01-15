import {AuthMiddleware} from "../../../presentation/middlewares/auth-middleware"
import {Middleware} from "../../../presentation/protocols"
import {makeDLoadAccountByToken} from "../use-cases/account/load-account-by-token/db-load-account-by-token-factory"

export const makeAuthMiddleware = (role?: string): Middleware => {
    return new AuthMiddleware(makeDLoadAccountByToken(), role)
}
