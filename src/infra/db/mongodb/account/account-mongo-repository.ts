import {AddAccountRepository} from "../../../../data/protocols/db/account/add-account-repository"
import {LoadAccountAccountByTokenRepository} from "../../../../data/protocols/db/account/load-account-account-by-token-repository"
import {LoadAccountByEmailRepository} from "../../../../data/protocols/db/account/load-account-by-email-repository"
import {UpdateAccessTokenRepository} from "../../../../data/protocols/db/account/update-access-token-repository"
import {AccountModel} from "../../../../domain/models/account"
import {AddAccountModel} from "../../../../domain/use-cases/add-account"
import {MongoHelper} from "../helpers/mongodb-helper"

export class AccountMongoRepository
    implements
        AddAccountRepository,
        LoadAccountByEmailRepository,
        UpdateAccessTokenRepository,
        LoadAccountAccountByTokenRepository
{
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

    async updateAccessToken(id: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection("accounts")

        await accountCollection.updateOne({_id: id}, {$set: {accessToken: token}})
    }

    async loadByToken(token: string, role?: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts")

        const result = await accountCollection.findOne({accessToken: token, role})

        return result && MongoHelper.map(result)
    }
}
