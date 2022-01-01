import request from "supertest"
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongodb-helper"
import app from "../config/app"
import env from "../config/env"

describe("Login Routes", () => {
    beforeAll(async () => {
        await MongoHelper.connect(env.mongoURL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    describe("POST /signup", () => {
        test("Should return 200 on signup", async () => {
            await request(app)
                .post("/api/signup")
                .send({
                    name: "any_name",
                    email: "any_name@mail.com",
                    password: "any_password",
                    passwordConfirmation: "any_password",
                })
                .expect(200)
        })
    })
})
