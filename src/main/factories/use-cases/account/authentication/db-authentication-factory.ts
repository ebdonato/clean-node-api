import env from "@/main/config/env"
import {BcryptAdapter} from "@/infra/cryptography/bcrypt-adapter/bcrypt-adapter"
import {JwtAdapter} from "@/infra/cryptography/jwt-adapter/jwt-adapter"
import {DbAuthentication} from "@/data/use-cases/authentication/db-authentication"
import {Authentication} from "@/domain/use-cases/authentication"
import {AccountMongoRepository} from "@/infra/db/mongodb/account/account-mongo-repository"

export const makeDbAuthentication = (): Authentication => {
    const accountMongoRepository = new AccountMongoRepository()

    const salt = 12

    const bcryptAdapter = new BcryptAdapter(salt)

    const jwtAdapter = new JwtAdapter(env.jwtSecret)

    return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
