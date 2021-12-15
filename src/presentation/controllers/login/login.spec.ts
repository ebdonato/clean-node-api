import {InvalidParamError, MissingParamError} from "../../errors"
import {badRequest, okResponse, serverError, unauthorizedError} from "../../helpers/http-helper"
import {EmailValidator, HttpRequest, Authentication} from "./login-protocols"
import {LoginController} from "./login"

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return !!email
        }
    }

    return new EmailValidatorStub()
}
const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(email: string, password: string): Promise<string> {
            email

            password

            return "some_token"
        }
    }

    return new AuthenticationStub()
}

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()

    const authenticationStub = makeAuthentication()

    const sut = new LoginController(emailValidatorStub, authenticationStub)

    return {
        sut,
        emailValidatorStub,
        authenticationStub,
    }
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: "any_name@mail.com",
        password: "any_password",
    },
})

describe("Login Controller", () => {
    test("Should return 400 if no email is provided", async () => {
        const {sut} = makeSut()

        const httpRequest = {
            body: {
                password: "any_password",
            },
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
    })

    test("Should return 400 if no password is provided", async () => {
        const {sut} = makeSut()

        const httpRequest = {
            body: {
                email: "any@mail.com",
            },
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
    })

    test("Should call EmailValidator with correct mail", async () => {
        const {sut, emailValidatorStub} = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)

        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    test("Should return 400 if an invalid email is provided", async () => {
        const {sut, emailValidatorStub} = makeSut()

        jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
    })

    test("Should return 500 if EmailValidator throws", async () => {
        const {sut, emailValidatorStub} = makeSut()

        jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
            throw new Error()
        })

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test("Should return 500 if Authentication throws", async () => {
        const {sut, authenticationStub} = makeSut()

        jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test("Should call Authentication with correct params", async () => {
        const {sut, authenticationStub} = makeSut()

        const authSpy = jest.spyOn(authenticationStub, "auth")

        const httpRequest = makeFakeRequest()

        const {email, password} = httpRequest.body

        await sut.handle(httpRequest)

        expect(authSpy).toHaveBeenCalledWith(email, password)
    })

    test("Should return 401 if invalid credentials are provided", async () => {
        const {sut, authenticationStub} = makeSut()

        jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(
            new Promise((resolve) => resolve(null as unknown as string))
        )

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(unauthorizedError())
    })

    test("Should return 200 if valid credentials are provided", async () => {
        const {sut} = makeSut()

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(okResponse({accessToken: "some_token"}))
    })
})
