import {Collection} from "mongodb"
import request from "supertest"
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongodb-helper"
import app from "../config/app"
import env from "../config/env"

describe("Survey Routes", () => {
    let surveyCollection: Collection

    beforeAll(async () => {
        await MongoHelper.connect(env.mongoURL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection("surveys")
        await surveyCollection.deleteMany({})
    })

    describe("POST /surveys", () => {
        test("Should return 204 on add survey success", async () => {
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
                .expect(204)
        })
    })
})
