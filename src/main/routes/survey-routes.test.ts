import {Collection} from "mongodb"
import request from "supertest"
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongodb-helper"
import app from "../config/app"
import env from "../config/env"
import {sign} from "jsonwebtoken"

describe("Survey Routes", () => {
    let surveyCollection: Collection
    let accountCollection: Collection

    beforeAll(async () => {
        await MongoHelper.connect(env.mongoURL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection("surveys")
        await surveyCollection.deleteMany({})

        accountCollection = await MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    describe("POST /surveys", () => {
        test("Should return 403 on add survey without access token", async () => {
            await request(app)
                .post("/api/surveys")
                .send({
                    question: "any_question",
                    answers: [
                        {
                            image: "any_image",
                            answer: "any_answer",
                        },
                        {
                            answer: "other_answer",
                        },
                    ],
                })
                .expect(403)
        })

        test("Should return 204 on add survey with valid token", async () => {
            const res = await accountCollection.insertOne({
                name: "any_name",
                email: "any_name@mail.com",
                password: "any_password",
                role: "admin",
            })

            const id = res.ops[0]._id

            const accessToken = sign({id}, env.jwtSecret)

            await accountCollection.updateOne({_id: id}, {$set: {accessToken}})

            await request(app)
                .post("/api/surveys")
                .set("x-access-token", accessToken)
                .send({
                    question: "any_question",
                    answers: [
                        {
                            image: "any_image",
                            answer: "any_answer",
                        },
                        {
                            answer: "other_answer",
                        },
                    ],
                })
                .expect(204)
        })
    })

    describe("GET /surveys", () => {
        test("Should return 403 on load surveys without access token", async () => {
            await request(app).get("/api/surveys").expect(403)
        })

        // test("Should return 204 on add survey with valid token", async () => {
        //     const res = await accountCollection.insertOne({
        //         name: "any_name",
        //         email: "any_name@mail.com",
        //         password: "any_password",
        //         role: "admin",
        //     })

        //     const id = res.ops[0]._id

        //     const accessToken = sign({id}, env.jwtSecret)

        //     await accountCollection.updateOne({_id: id}, {$set: {accessToken}})

        //     await request(app)
        //         .post("/api/surveys")
        //         .set("x-access-token", accessToken)
        //         .send({
        //             question: "any_question",
        //             answers: [
        //                 {
        //                     image: "any_image",
        //                     answer: "any_answer",
        //                 },
        //                 {
        //                     answer: "other_answer",
        //                 },
        //             ],
        //         })
        //         .expect(204)
        // })
    })
})
