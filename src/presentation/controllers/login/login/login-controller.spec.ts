import {HttpRequest, Authentication, Validation, AuthenticationModel} from "./login-controller-protocols"
import {LoginController} from "./login-controller"
import {MissingParamError} from "@/presentation/errors"
import {badRequest, okResponse, serverError, unauthorizedError} from "@/presentation/helpers/http/http-helper"

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(authentication: AuthenticationModel): Promise<string> {
            authentication

            return "some_token"
        }
    }

    return new AuthenticationStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            input

            return null as unknown as Error
        }
    }

    return new ValidationStub()
}

interface SutTypes {
    sut: LoginController
    authenticationStub: Authentication
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const authenticationStub = makeAuthentication()

    const validationStub = makeValidation()

    const sut = new LoginController(authenticationStub, validationStub)

    return {
        sut,
        authenticationStub,
        validationStub,
    }
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: "any_name@mail.com",
        password: "any_password",
    },
})

describe("Login Controller", () => {
    test("Should call Authentication with correct params", async () => {
        const {sut, authenticationStub} = makeSut()

        const authSpy = jest.spyOn(authenticationStub, "auth")

        const httpRequest = makeFakeRequest()

        const {email, password} = httpRequest.body

        await sut.handle(httpRequest)

        expect(authSpy).toHaveBeenCalledWith({email, password})
    })

    test("Should return 401 if invalid credentials are provided", async () => {
        const {sut, authenticationStub} = makeSut()

        jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(
            new Promise((resolve) => resolve(null as unknown as string))
        )

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(unauthorizedError())
    })

    test("Should return 500 if Authentication throws", async () => {
        const {sut, authenticationStub} = makeSut()

        jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test("Should return 200 if valid credentials are provided", async () => {
        const {sut} = makeSut()

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(okResponse({accessToken: "some_token"}))
    })

    test("Should call Validation with correct values", async () => {
        const {sut, validationStub} = makeSut()

        const validationSpy = jest.spyOn(validationStub, "validate")

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)

        expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test("Should return 400 if Validation returns an error", async () => {
        const {sut, validationStub} = makeSut()

        jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("any_field"))

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
    })
})
