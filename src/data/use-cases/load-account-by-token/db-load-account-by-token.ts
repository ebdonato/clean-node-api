import {LoadAccountByToken} from "../../../domain/use-cases/load-account-by-token"
import {Decrypter} from "../../protocols/cryptography/decrypter"
import {AccountModel} from "../add-account/db-add-account-protocols"

export class DbLoadAccountAccountByToken implements LoadAccountByToken {
    constructor(private readonly decrypter: Decrypter) {}

    async load(accessToken: string, role?: string): Promise<AccountModel> {
        this.decrypter.decrypt(accessToken)

        role

        return null as unknown as AccountModel
    }
}
