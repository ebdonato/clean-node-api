import request from "supertest"
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongodb-helper"
import app from "../config/app"

describe("SignUp Routes", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    test("Should return an account on success", async () => {
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
