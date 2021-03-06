import {MongoHelper} from "../helpers/mongodb-helper"
import {SurveyModel} from "@/domain/models/survey"
import {AddSurveyModel} from "@/domain/use-cases/add-survey"
import {AddSurveyRepository} from "@/data/protocols/db/survey/add-survey-repository"
import {LoadSurveysRepository} from "@/data/protocols/db/survey/load-surveys-repository"

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
    async add(surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection("surveys")

        await surveyCollection.insertOne(surveyData)
    }

    async loadAll(): Promise<SurveyModel[]> {
        const surveyCollection = await MongoHelper.getCollection("surveys")

        const surveys: SurveyModel[] = await surveyCollection.find().toArray()

        return surveys
    }
}
