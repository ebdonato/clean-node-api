import {LogControllerDecorator} from "./log-controller-decorators"
import {Controller, HttpRequest, HttpResponse} from "@/presentation/protocols"
import {okResponse, serverError} from "@/presentation/helpers/http/http-helper"
import {LogErrorRepository} from "@/data/protocols/db/log/log-error-repository"
import {AccountModel} from "@/domain/models/account"

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            httpRequest

            return new Promise((resolve) => resolve(okResponse(makeFakeAccount())))
        }
    }

    return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError(stack: string): Promise<void> {
            stack

            return new Promise((resolve) => resolve())
        }
    }

    return new LogErrorRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid_name",
    email: "valid_name@mail.com",
    password: "valid_password",
})

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: "any_name",
        email: "any_name@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
    },
})

const makeFakeServerError = (): HttpResponse => {
    const fakeError = new Error()

    fakeError.stack = "any_stack"

    return serverError(fakeError)
}

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()

    const logErrorRepositoryStub = makeLogErrorRepositoryStub()

    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub,
    }
}

describe("LogController Decorator", () => {
    test("Should call controller handle ", async () => {
        const {sut, controllerStub} = makeSut()

        const handleSpy = jest.spyOn(controllerStub, "handle")

        await sut.handle(makeFakeRequest())

        expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
    })

    test("Should return the same result of the controller", async () => {
        const {sut} = makeSut()

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(okResponse(makeFakeAccount()))
    })

    test("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
        const {sut, controllerStub, logErrorRepositoryStub} = makeSut()

        const logSpy = jest.spyOn(logErrorRepositoryStub, "logError")

        jest.spyOn(controllerStub, "handle").mockReturnValueOnce(
            new Promise((resolve) => resolve(makeFakeServerError()))
        )

        await sut.handle(makeFakeRequest())

        expect(logSpy).toHaveBeenCalledWith("any_stack")
    })
})
