import {noContentResponse, okResponse, serverError} from "../../../helpers/http/http-helper"
import {Controller, HttpRequest, HttpResponse, LoadSurveys} from "./load-surveys-controller-protocols"

export class LoadSurveysController implements Controller {
    constructor(private readonly loadSurveys: LoadSurveys) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        httpRequest

        try {
            const surveys = await this.loadSurveys.load()

            return surveys.length ? okResponse(surveys) : noContentResponse()
        } catch (error) {
            return serverError(error as Error)
        }
    }
}
