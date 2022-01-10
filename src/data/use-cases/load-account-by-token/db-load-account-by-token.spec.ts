import {Decrypter} from "../../protocols/cryptography/decrypter"
import {DbLoadAccountAccountByToken} from "./db-load-account-by-token"

describe("DbLoadAccountByToken Use case", () => {
    test("Shoud call Decrypter with correct values", async () => {
        class DecrypterStub implements Decrypter {
            async decrypt(value: string): Promise<string> {
                value

                return new Promise((resolve) => resolve("any_value"))
            }
        }

        const decrypterStub = new DecrypterStub()

        const decryptSpy = jest.spyOn(decrypterStub, "decrypt")

        const sut = new DbLoadAccountAccountByToken(decrypterStub)

        await sut.load("any_token")

        expect(decryptSpy).toHaveBeenCalledWith("any_token")
    })
})
