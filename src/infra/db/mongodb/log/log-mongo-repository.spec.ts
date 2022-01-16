import {MongoHelper} from "../helpers/mongodb-helper"
import {LogMongoRepository} from "./log-mongo-repository"
import env from "@/main/config/env"
import {Collection} from "mongodb"

const makeSut = () => new LogMongoRepository()

describe("Log Mongo Repository", () => {
    let errorCollection: Collection

    beforeAll(async () => {
        await MongoHelper.connect(env.mongoURL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        errorCollection = await MongoHelper.getCollection("errors")
        await errorCollection.deleteMany({})
    })

    test("Should create an error log on success", async () => {
        const sut = makeSut()

        await sut.logError("any error")

        const count = await errorCollection.countDocuments()

        expect(count).toBe(1)
    })
})
