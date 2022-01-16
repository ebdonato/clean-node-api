import env from "@/main/config/env"
import {LoadAccountByToken} from "@/domain/use-cases/load-account-by-token"
import {DbLoadAccountAccountByToken} from "@/data/use-cases/load-account-by-token/db-load-account-by-token"
import {JwtAdapter} from "@/infra/cryptography/jwt-adapter/jwt-adapter"
import {AccountMongoRepository} from "@/infra/db/mongodb/account/account-mongo-repository"

export const makeDLoadAccountByToken = (): LoadAccountByToken => {
    const jwtAdapter = new JwtAdapter(env.jwtSecret)

    const accountMongoRepository = new AccountMongoRepository()

    return new DbLoadAccountAccountByToken(jwtAdapter, accountMongoRepository)
}
