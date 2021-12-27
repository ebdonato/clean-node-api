import {AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher} from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount {
    private readonly hasher: Hasher
    private readonly addAccountRepository: AddAccountRepository

    constructor(hasher: Hasher, addAccountRepository: AddAccountRepository) {
        this.hasher = hasher

        this.addAccountRepository = addAccountRepository
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        const password = await this.hasher.hash(account.password)

        const addedAccount = await this.addAccountRepository.add(Object.assign({}, account, {password}))

        return addedAccount
    }
}
