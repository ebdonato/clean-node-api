import {Collection} from "mongodb"
import {MongoHelper} from "../helpers/mongodb-helper"
import {AccountMongoRepository} from "./account-mongo-repository"
import env from "../../../../main/config/env"

describe("Account Mongo Repository", () => {
    let accountCollection: Collection

    beforeAll(async () => {
        await MongoHelper.connect(env.mongoURL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection("accounts")

        await accountCollection.deleteMany({})
    })

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository()
    }

    describe("add()", () => {
        test("Should return an account on add success", async () => {
            const sut = makeSut()

            const account = await sut.add({
                name: "any_name",
                email: "any_name@mail.com",
                password: "any_password",
            })

            expect(account?.id).toBeTruthy()

            expect(account.name).toBe("any_name")

            expect(account.email).toBe("any_name@mail.com")

            expect(account.password).toBe("any_password")
        })
    })

    describe("loadByEmail()", () => {
        test("Should return an account on loadByEmail success", async () => {
            const sut = makeSut()

            await accountCollection.insertOne({
                name: "any_name",
                email: "any_name@mail.com",
                password: "any_password",
            })

            const account = await sut.loadByEmail("any_name@mail.com")

            expect(account?.id).toBeTruthy()

            expect(account.name).toBe("any_name")

            expect(account.email).toBe("any_name@mail.com")

            expect(account.password).toBe("any_password")
        })

        test("Should return null with loadByEmail fails", async () => {
            const sut = makeSut()

            const account = await sut.loadByEmail("any_name@mail.com")

            expect(account?.id).toBeFalsy()
        })
    })

    describe("updateAccessToken()", () => {
        test("Should update the account accessToken on updateAccessToken success", async () => {
            const sut = makeSut()

            const result = await accountCollection.insertOne({
                name: "any_name",
                email: "any_name@mail.com",
                password: "any_password",
            })

            const {_id, accessToken} = result.ops[0]

            expect(accessToken).toBeFalsy()

            await sut.updateAccessToken(_id, "any_token")

            const account = await accountCollection.findOne({_id})

            expect(account).toBeTruthy()

            expect(account.accessToken).toBe("any_token")
        })
    })

    describe("loadByToken()", () => {
        test("Should return an account on loadByToken without role", async () => {
            const sut = makeSut()

            await accountCollection.insertOne({
                name: "any_name",
                email: "any_name@mail.com",
                password: "any_password",
                accessToken: "any_token",
            })

            const account = await sut.loadByToken("any_token")

            expect(account?.id).toBeTruthy()

            expect(account.name).toBe("any_name")

            expect(account.email).toBe("any_name@mail.com")

            expect(account.password).toBe("any_password")
        })

        test("Should return an account on loadByToken with role", async () => {
            const sut = makeSut()

            await accountCollection.insertOne({
                name: "any_name",
                email: "any_name@mail.com",
                password: "any_password",
                accessToken: "any_token",
                role: "any_role",
            })

            const account = await sut.loadByToken("any_token", "any_role")

            expect(account?.id).toBeTruthy()

            expect(account.name).toBe("any_name")

            expect(account.email).toBe("any_name@mail.com")

            expect(account.password).toBe("any_password")
        })

        test("Should return null with loadByToken fails", async () => {
            const sut = makeSut()

            const account = await sut.loadByToken("any_token")

            expect(account?.id).toBeFalsy()
        })
    })
})
