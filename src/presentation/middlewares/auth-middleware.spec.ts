import {AccessDeniedError} from "../errors"
import {forbiddenError, okResponse, serverError} from "../helpers/http/http-helper"
import {AuthMiddleware} from "./auth-middleware"
import {LoadAccountByToken} from "../../domain/use-cases/load-account-by-token"
import {AccountModel} from "../../domain/models/account"
import {HttpRequest} from "../protocols"

const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid_name",
    email: "valid_name@mail.com",
    password: "valid_password",
})

interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeFakeRequest = (): HttpRequest => ({
    headers: {
        "x-access-token": "any_token",
    },
})

const makeSut = (): SutTypes => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load(accessToken: string, role?: string): Promise<AccountModel> {
            accessToken

            role

            return new Promise((resolve) => resolve(makeFakeAccount()))
        }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub()

    const sut = new AuthMiddleware(loadAccountByTokenStub)

    return {
        sut,
        loadAccountByTokenStub,
    }
}

describe("Auth Middleware", () => {
    test("Should return 403 if no x-access-token exists in header", async () => {
        const {sut} = makeSut()

        const httpResponse = await sut.handle({})

        expect(httpResponse).toEqual(forbiddenError(new AccessDeniedError()))
    })

    test("Should call LoadAccountByToken with correct accessToken", async () => {
        const {sut, loadAccountByTokenStub} = makeSut()

        const loadSpy = jest.spyOn(loadAccountByTokenStub, "load")

        await sut.handle(makeFakeRequest())

        expect(loadSpy).toHaveBeenCalledWith("any_token")
    })

    test("Should return 403 if LoadAccountByToken returns null", async () => {
        const {sut, loadAccountByTokenStub} = makeSut()

        jest.spyOn(loadAccountByTokenStub, "load").mockReturnValueOnce(
            new Promise((resolve) => resolve(null as unknown as AccountModel))
        )

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(forbiddenError(new AccessDeniedError()))
    })

    test("Should return 200 if LoadAccountByToken returns an account", async () => {
        const {sut} = makeSut()

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(okResponse({accountID: "valid_id"}))
    })

    test("Should return 500 if LoadAccountByToken throws", async () => {
        const {sut, loadAccountByTokenStub} = makeSut()

        jest.spyOn(loadAccountByTokenStub, "load").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
