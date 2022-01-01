import {AccountModel, AddAccount, AddAccountModel, HttpRequest, Validation} from "./signup-controller-protocols"
import {MissingParamError} from "../../errors"
import {SignUpController} from "./signup-controller"
import {badRequest, okResponse, serverError} from "../../helpers/http/http-helper"

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            account

            return new Promise((resolve) => resolve(makeFakeAccount()))
        }
    }

    return new AddAccountStub()
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
}

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccount()

    const validationStub = makeValidation()

    const sut = new SignUpController(addAccountStub, validationStub)

    return {
        sut,
        addAccountStub,
        validationStub,
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

    test("Should return 200 if valid data is provided", async () => {
        const {sut} = makeSut()

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(okResponse(makeFakeAccount()))
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