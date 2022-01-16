import {Decrypter} from "../../protocols/cryptography/decrypter"
import {AccountModel} from "../add-account/db-add-account-protocols"
import {DbLoadAccountAccountByToken} from "./db-load-account-by-token"
import {LoadAccountAccountByTokenRepository} from "../../protocols/db/account/load-account-account-by-token-repository"

const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid_name",
    email: "valid_name@mail.com",
    password: "valid_password",
})

interface SutTypes {
    sut: DbLoadAccountAccountByToken
    decrypterStub: Decrypter
    loadAccountAccountByTokenRepositoryStub: LoadAccountAccountByTokenRepository
}

const makeSut = (): SutTypes => {
    class DecrypterStub implements Decrypter {
        async decrypt(value: string): Promise<string> {
            value

            return new Promise((resolve) => resolve("any_value"))
        }
    }

    class LoadAccountAccountByTokenRepositoryStub implements LoadAccountAccountByTokenRepository {
        async loadByToken(token: string, role?: string): Promise<AccountModel> {
            token

            role

            return new Promise((resolve) => resolve(makeFakeAccount()))
        }
    }

    const decrypterStub = new DecrypterStub()

    const loadAccountAccountByTokenRepositoryStub = new LoadAccountAccountByTokenRepositoryStub()

    const sut = new DbLoadAccountAccountByToken(decrypterStub, loadAccountAccountByTokenRepositoryStub)

    return {
        sut,
        decrypterStub,
        loadAccountAccountByTokenRepositoryStub,
    }
}

describe("DbLoadAccountByToken Use case", () => {
    test("Should call Decrypter with correct values", async () => {
        const {sut, decrypterStub} = makeSut()

        const decryptSpy = jest.spyOn(decrypterStub, "decrypt")

        await sut.load("any_token", "any_role")

        expect(decryptSpy).toHaveBeenCalledWith("any_token")
    })

    test("Should return null if Decrypter returns null", async () => {
        const {sut, decrypterStub} = makeSut()

        jest.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(
            new Promise((resolve) => resolve(null as unknown as string))
        )

        const account = await sut.load("any_token", "any_role")

        expect(account).toBeNull()
    })

    test("Should call LoadAccountAccountByTokenRepository with correct values", async () => {
        const {sut, loadAccountAccountByTokenRepositoryStub} = makeSut()

        const loadByTokenSpy = jest.spyOn(loadAccountAccountByTokenRepositoryStub, "loadByToken")

        await sut.load("any_token", "any_role")

        expect(loadByTokenSpy).toHaveBeenCalledWith("any_token", "any_role")
    })

    test("Should return null if LoadAccountAccountByTokenRepository returns null", async () => {
        const {sut, loadAccountAccountByTokenRepositoryStub} = makeSut()

        jest.spyOn(loadAccountAccountByTokenRepositoryStub, "loadByToken").mockReturnValueOnce(
            new Promise((resolve) => resolve(null as unknown as AccountModel))
        )

        const account = await sut.load("any_token", "any_role")

        expect(account).toBeNull()
    })

    test("Should return an account on success", async () => {
        const {sut} = makeSut()

        const account = await sut.load("any_token", "any_role")

        expect(account).toEqual(makeFakeAccount())
    })

    test("Should throws if Decrypter throws", async () => {
        const {sut, decrypterStub} = makeSut()

        jest.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.load("any_token", "any_role")

        expect(promise).rejects.toThrow()
    })

    test("Should throws if LoadAccountAccountByTokenRepository throws", async () => {
        const {sut, loadAccountAccountByTokenRepositoryStub} = makeSut()

        jest.spyOn(loadAccountAccountByTokenRepositoryStub, "loadByToken").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const promise = sut.load("any_token", "any_role")

        expect(promise).rejects.toThrow()
    })
})
