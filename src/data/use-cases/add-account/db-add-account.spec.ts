import {AddAccountRepository} from "../../protocols/add-account-repository"
import {DbAddAccount} from "./db-add-account"
import {AccountModel, AddAccountModel, Encrypter} from "./db-add-account-protocols"

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            value

            return new Promise((resolve) => resolve("hashed_value"))
        }
    }

    return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(account: AddAccountModel): Promise<AccountModel> {
            account

            return new Promise((resolve) => resolve(makeFakeAccount()))
        }
    }

    return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid_name",
    email: "valid_name@mail.com",
    password: "valid_password",
})

const makeFakeAccountData = (): AddAccountModel => ({
    name: "valid name",
    email: "valid email",
    password: "valid password",
})

interface SutTypes {
    sut: DbAddAccount
    encryptSpyStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const encryptSpyStub = makeEncrypter()

    const addAccountRepositoryStub = makeAddAccountRepository()

    const sut = new DbAddAccount(encryptSpyStub, addAccountRepositoryStub)

    return {
        sut,
        encryptSpyStub,
        addAccountRepositoryStub,
    }
}

describe("DBAccount Use case", () => {
    test("Should call Encrypter with correct password", async () => {
        const {sut, encryptSpyStub} = makeSut()

        const encryptSpy = jest.spyOn(encryptSpyStub, "encrypt")

        await sut.add(makeFakeAccountData())

        expect(encryptSpy).toHaveBeenCalledWith("valid password")
    })

    test("Should throw if Encrypter throws", async () => {
        const {sut, encryptSpyStub} = makeSut()

        jest.spyOn(encryptSpyStub, "encrypt").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const accountData = {
            name: "valid name",
            email: "valid email",
            password: "valid password",
        }

        const promise = sut.add(accountData)

        await expect(promise).rejects.toThrow()
    })

    test("Should call AddAccountRepository with correct values", async () => {
        const {sut, addAccountRepositoryStub} = makeSut()

        const addSpy = jest.spyOn(addAccountRepositoryStub, "add")

        await sut.add(makeFakeAccountData())

        expect(addSpy).toBeCalledWith({
            name: "valid name",
            email: "valid email",
            password: "hashed_value",
        })
    })

    test("Should throw if AddAccountRepository throws", async () => {
        const {sut, addAccountRepositoryStub} = makeSut()

        jest.spyOn(addAccountRepositoryStub, "add").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const promise = sut.add(makeFakeAccountData())

        await expect(promise).rejects.toThrow()
    })

    test("Should return an account on success", async () => {
        const {sut} = makeSut()

        const account = await sut.add(makeFakeAccountData())

        expect(account).toEqual(makeFakeAccount())
    })
})
