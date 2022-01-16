import {LoadSurveysController} from "../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller"
import {Controller} from "../../../../../presentation/protocols"
import {makeLogControllerDecorator} from "../../../decorators/log-controller-decorator-factory"
import {makeDbLoadSurveys} from "../../../use-cases/survey/load-survey/db-load-survey-factory"

export const makeLoadSurveysController = (): Controller => {
    const loadSurveyController = new LoadSurveysController(makeDbLoadSurveys())

    return makeLogControllerDecorator(loadSurveyController)
}
