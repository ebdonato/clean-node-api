import {okResponse} from "../../../helpers/http/http-helper"
import {Controller, HttpRequest, HttpResponse, LoadSurveys} from "./load-surveys-controller-protocols"

export class LoadSurveysController implements Controller {
    constructor(private readonly loadSurveys: LoadSurveys) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        httpRequest

        const surveys = await this.loadSurveys.load()

        return okResponse(surveys)
    }
}
