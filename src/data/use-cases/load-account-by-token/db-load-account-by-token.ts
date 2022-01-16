import {Decrypter} from "@/data/protocols/cryptography/decrypter"
import {LoadAccountAccountByTokenRepository} from "@/data/protocols/db/account/load-account-account-by-token-repository"
import {LoadAccountByToken} from "@/domain/use-cases/load-account-by-token"
import {AccountModel} from "@/domain/models/account"

export class DbLoadAccountAccountByToken implements LoadAccountByToken {
    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadAccountAccountByTokenRepository: LoadAccountAccountByTokenRepository
    ) {}

    async load(accessToken: string, role?: string): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken)

        if (token) {
            const account = await this.loadAccountAccountByTokenRepository.loadByToken(accessToken, role)

            if (account) return account
        }

        return null as unknown as AccountModel
    }
}
