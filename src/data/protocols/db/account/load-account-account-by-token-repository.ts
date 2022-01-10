import {AccountModel} from "../../../../domain/models/account"

export interface LoadAccountAccountByTokenRepository {
    loadByToken(token: string, role?: string): Promise<AccountModel>
}
