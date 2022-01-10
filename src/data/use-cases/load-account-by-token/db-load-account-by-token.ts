import {LoadAccountByToken} from "../../../domain/use-cases/load-account-by-token"
import {Decrypter} from "../../protocols/cryptography/decrypter"
import {LoadAccountAccountByTokenRepository} from "../../protocols/db/account/load-account-account-by-token-repository"
import {AccountModel} from "../add-account/db-add-account-protocols"

export class DbLoadAccountAccountByToken implements LoadAccountByToken {
    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadAccountAccountByTokenRepository: LoadAccountAccountByTokenRepository
    ) {}

    async load(accessToken: string, role?: string): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken)

        if (token) {
            await this.loadAccountAccountByTokenRepository.loadByToken(accessToken, role)
        }

        role

        return null as unknown as AccountModel
    }
}
