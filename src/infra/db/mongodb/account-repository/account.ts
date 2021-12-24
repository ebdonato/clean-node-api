import {AddAccountRepository} from "../../../../data/protocols/db/add-account-repository"
import {AccountModel} from "../../../../domain/models/account"
import {AddAccountModel} from "../../../../domain/use-cases/add-account"
import {MongoHelper} from "../helpers/mongodb-helper"

export class AccountMongoRepository implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts")

        const result = await accountCollection.insertOne(account)

        return MongoHelper.map(result.ops[0])
    }
}
