import {MongoHelper as sut} from "./mongodb-helper"
import env from "@/main/config/env"

describe("Mongo Helper", () => {
    beforeAll(async () => {
        await sut.connect(env.mongoURL as string)
    })

    afterAll(async () => {
        await sut.disconnect()
    })

    test("Should reconnect if mongodb is down", async () => {
        let accountCollection = await sut.getCollection("accounts")

        expect(accountCollection).toBeTruthy()

        await sut.disconnect()

        accountCollection = await sut.getCollection("accounts")

        expect(accountCollection).toBeTruthy()
    })
})
