import {AddAccountRepository} from "../../../../data/protocols/db/add-account-repository"
import {LoadAccountByEmailRepository} from "../../../../data/protocols/db/load-account-by-email-repository"
import {AccountModel} from "../../../../domain/models/account"
import {AddAccountModel} from "../../../../domain/use-cases/add-account"
import {MongoHelper} from "../helpers/mongodb-helper"

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts")

        const result = await accountCollection.insertOne(account)

        return MongoHelper.map(result.ops[0])
    }

    async loadByEmail(email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts")

        const result = await accountCollection.findOne({email})

        return result && MongoHelper.map(result)
    }
}
