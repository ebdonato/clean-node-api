import {Collection} from "mongodb"
import {MongoHelper} from "../helpers/mongodb-helper"
import {SurveyMongoRepository} from "./survey-mongo-repository"
import env from "../../../../main/config/env"
import {AddSurveyModel} from "../../../../domain/use-cases/add-survey"

const makeFakeSurveyData = (): AddSurveyModel => ({
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

describe("Survey Mongo Repository", () => {
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

    const makeSut = (): SurveyMongoRepository => {
        return new SurveyMongoRepository()
    }

    test("Should add a survey on success", async () => {
        const sut = makeSut()

        await sut.add(makeFakeSurveyData())

        const survey = await surveyCollection.findOne({question: "any_question"})

        expect(survey).toBeTruthy()
    })
})
