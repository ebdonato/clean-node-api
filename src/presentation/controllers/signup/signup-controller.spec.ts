import {
    AccountModel,
    AddAccount,
    AddAccountModel,
    HttpRequest,
    Validation,
    Authentication,
    AuthenticationModel,
} from "./signup-controller-protocols"
import {EmailInUseError, MissingParamError} from "../../errors"
import {SignUpController} from "./signup-controller"
import {badRequest, forbiddenError, okResponse, serverError} from "../../helpers/http/http-helper"

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            account

            return new Promise((resolve) => resolve(makeFakeAccount()))
        }
    }

    return new AddAccountStub()
}

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

interface SutTypes {
    sut: SignUpController
    addAccountStub: AddAccount
    validationStub: Validation
    authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccount()

    const validationStub = makeValidation()

    const authenticationStub = makeAuthentication()

    const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

    return {
        sut,
        addAccountStub,
        validationStub,
        authenticationStub,
    }
}

describe("SignUp Controller", () => {
    test("Should return 500 if AddAccount throws", async () => {
        const {sut, addAccountStub} = makeSut()

        jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
            return new Promise((resolve, reject) => reject(new Error()))
        })

        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test("Should call AddAccount with correct mail", async () => {
        const {sut, addAccountStub} = makeSut()

        const addSpy = jest.spyOn(addAccountStub, "add")

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)

        expect(addSpy).toHaveBeenCalledWith({
            name: "any_name",
            email: "any_name@mail.com",
            password: "any_password",
        })
    })

    test("Should return 403 if AddAccount returns null", async () => {
        const {sut, addAccountStub} = makeSut()

        jest.spyOn(addAccountStub, "add").mockReturnValueOnce(
            new Promise((resolve) => resolve(null as unknown as AccountModel))
        )

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(forbiddenError(new EmailInUseError()))
    })

    test("Should return 200 if valid data is provided", async () => {
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

    test("Should call Authentication with correct params", async () => {
        const {sut, authenticationStub} = makeSut()

        const authSpy = jest.spyOn(authenticationStub, "auth")

        const httpRequest = makeFakeRequest()

        const {email, password} = httpRequest.body

        await sut.handle(httpRequest)

        expect(authSpy).toHaveBeenCalledWith({email, password})
    })

    test("Should return 500 if Authentication throws", async () => {
        const {sut, authenticationStub} = makeSut()

        jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
