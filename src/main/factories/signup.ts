import {DbAddAccount} from "../../data/use-cases/add-account/db-add-account"
import {BcryptAdapter} from "../../infra/cryptography/bcrypt-adapter"
import {AccountMongoRepository} from "../../infra/db/mongodb/account-repository/account"
import {SignUpController} from "../../presentation/controllers/signup/signup"
import {EmailValidatorAdapter} from "../../utils/email-validator-adapter"

export const makeSignupController = (): SignUpController => {
    const emailValidatorAdapter = new EmailValidatorAdapter()

    const salt = 12

    const bcryptAdapter = new BcryptAdapter(salt)

    const accountMongoRepository = new AccountMongoRepository()

    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

    return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
