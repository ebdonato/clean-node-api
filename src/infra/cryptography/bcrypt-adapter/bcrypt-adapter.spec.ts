import {BcryptAdapter} from "./bcrypt-adapter"
import bcrypt from "bcrypt"

jest.mock("bcrypt", () => ({
    async hash(): Promise<string> {
        return new Promise((resolve) => resolve("hash"))
    },
    async compare(): Promise<boolean> {
        return new Promise((resolve) => resolve(true))
    },
}))

type SutTypes = {
    sut: BcryptAdapter
    salt: number
}

const makeSut = (): SutTypes => {
    const salt = 12

    const sut = new BcryptAdapter(salt)

    return {
        sut,
        salt,
    }
}

describe("Bcrypt Adapter", () => {
    describe("hash()", () => {
        test("Should call hash with correct values", async () => {
            const {sut, salt} = makeSut()

            const hashSpy = jest.spyOn(bcrypt, "hash")

            await sut.hash("any_value")

            expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
        })

        test("Should return a valid hash on hash success", async () => {
            const {sut} = makeSut()

            const hash = await sut.hash("any_value")

            expect(hash).toBe("hash")
        })

        test("Should throw if hash throws", async () => {
            const {sut} = makeSut()

            // jest.spyOn(bcrypt, "hash").mockReturnValueOnce(new Promise((_, reject) => reject(new Error())))

            jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
                throw new Error()
            })

            const promise = sut.hash("any_value")

            await expect(promise).rejects.toThrow()
        })
    })

    describe("sign()", () => {
        test("Should call compare with correct values", async () => {
            const {sut} = makeSut()

            const compareSpy = jest.spyOn(bcrypt, "compare")

            await sut.compare("any_value", "any_hash")

            expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash")
        })

        test("Should return true when compare success", async () => {
            const {sut} = makeSut()

            const isValid = await sut.compare("any_value", "any_hash")

            expect(isValid).toBe(true)
        })

        test("Should return true when compare success", async () => {
            const {sut} = makeSut()

            jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => false)

            const isValid = await sut.compare("any_value", "any_hash")

            expect(isValid).toBe(false)
        })

        test("Should throw if hash throws", async () => {
            const {sut} = makeSut()

            // jest.spyOn(bcrypt, "hash").mockReturnValueOnce(new Promise((_, reject) => reject(new Error())))

            jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
                throw new Error()
            })

            const promise = sut.compare("any_value", "any_hash")

            await expect(promise).rejects.toThrow()
        })
    })
})
