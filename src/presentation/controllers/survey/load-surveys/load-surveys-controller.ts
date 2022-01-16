import {Controller, HttpRequest, HttpResponse, LoadSurveys} from "./load-surveys-controller-protocols"
import {noContentResponse, okResponse, serverError} from "@/presentation/helpers/http/http-helper"

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
