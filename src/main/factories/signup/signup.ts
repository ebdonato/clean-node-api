import {DbAddAccount} from "../../../data/use-cases/add-account/db-add-account"
import {BcryptAdapter} from "../../../infra/cryptography/bcrypt-adapter"
import {AccountMongoRepository} from "../../../infra/db/mongodb/account-repository/account"
import {LogMongoRepository} from "../../../infra/db/mongodb/log-repository/log"
import {SignUpController} from "../../../presentation/controllers/signup/signup"
import {Controller} from "../../../presentation/protocols"
import {LogControllerDecorator} from "../../decorators/log"
import {makeSignupValidation} from "./signup-validation"

export const makeSignupController = (): Controller => {
    const salt = 12

    const bcryptAdapter = new BcryptAdapter(salt)

    const accountMongoRepository = new AccountMongoRepository()

    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

    const signUpController = new SignUpController(dbAddAccount, makeSignupValidation())

    const logMongoRepository = new LogMongoRepository()

    return new LogControllerDecorator(signUpController, logMongoRepository)
}
