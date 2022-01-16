import app from "@/main/config/app"
import env from "@/main/config/env"
import {MongoHelper} from "@/infra/db/mongodb/helpers/mongodb-helper"
import {Collection} from "mongodb"
import request from "supertest"
import {hash} from "bcrypt"

describe("Login Routes", () => {
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

    describe("POST /login", () => {
        test("Should return 200 on login", async () => {
            const password = "any_password"

            const salt = 12

            const hashedPassword = await hash(password, salt)

            await accountCollection.insertOne({
                name: "any_name",
                email: "any_name@mail.com",
                password: hashedPassword,
            })

            await request(app)
                .post("/api/login")
                .send({
                    email: "any_name@mail.com",
                    password,
                })
                .expect(200)
        })

        test("Should return 401 on login", async () => {
            await request(app)
                .post("/api/login")
                .send({
                    email: "any_name@mail.com",
                    password: "any_password",
                })
                .expect(401)
        })
    })
})
