import {AddSurveyController} from "../../../../presentation/controllers/survey/add-survey/add-survey-controller"
import {Controller} from "../../../../presentation/protocols"
import {makeDbAddSurvey} from "../../use-cases/db-add-survey-factory.ts/db-add-survey-factory"
import {makeLogControllerDecorator} from "../decorators/log-controller-decorator-factory"
import {makeAddSurveyValidation} from "./add-survey-validation-factory"

export const makeAddSurveyController = (): Controller => {
    const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())

    return makeLogControllerDecorator(addSurveyController)
}
