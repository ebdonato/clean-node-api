import {AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher} from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount {
    constructor(private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) {}

    async add(account: AddAccountModel): Promise<AccountModel> {
        const password = await this.hasher.hash(account.password)

        const addedAccount = await this.addAccountRepository.add(Object.assign({}, account, {password}))

        return addedAccount
    }
}
