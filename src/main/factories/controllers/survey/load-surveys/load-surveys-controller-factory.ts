import {makeLogControllerDecorator} from "@/main/factories/decorators/log-controller-decorator-factory"
import {makeDbLoadSurveys} from "@/main/factories/use-cases/survey/load-survey/db-load-survey-factory"
import {LoadSurveysController} from "@/presentation/controllers/survey/load-surveys/load-surveys-controller"
import {Controller} from "@/presentation/protocols"

export const makeLoadSurveysController = (): Controller => {
    const loadSurveyController = new LoadSurveysController(makeDbLoadSurveys())

    return makeLogControllerDecorator(loadSurveyController)
}
