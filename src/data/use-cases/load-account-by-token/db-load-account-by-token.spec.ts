import {Decrypter} from "../../protocols/cryptography/decrypter"
import {DbLoadAccountAccountByToken} from "./db-load-account-by-token"

interface SutTypes {
    sut: DbLoadAccountAccountByToken
    decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
    class DecrypterStub implements Decrypter {
        async decrypt(value: string): Promise<string> {
            value

            return new Promise((resolve) => resolve("any_value"))
        }
    }

    const decrypterStub = new DecrypterStub()

    const sut = new DbLoadAccountAccountByToken(decrypterStub)

    return {
        sut,
        decrypterStub,
    }
}

describe("DbLoadAccountByToken Use case", () => {
    test("Shoud call Decrypter with correct values", async () => {
        const {sut, decrypterStub} = makeSut()

        const decryptSpy = jest.spyOn(decrypterStub, "decrypt")

        await sut.load("any_token")

        expect(decryptSpy).toHaveBeenCalledWith("any_token")
    })
})
