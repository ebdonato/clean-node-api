import {makeAddSurveyValidation} from "./add-survey-validation-factory"
import {makeDbAddSurvey} from "@/main/factories/use-cases/survey/add-survey/db-add-survey-factory"
import {makeLogControllerDecorator} from "@/main/factories/decorators/log-controller-decorator-factory"
import {AddSurveyController} from "@/presentation/controllers/survey/add-survey/add-survey-controller"
import {Controller} from "@/presentation/protocols"

export const makeAddSurveyController = (): Controller => {
    const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())

    return makeLogControllerDecorator(addSurveyController)
}
