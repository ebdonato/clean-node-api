import {DbAddAccount} from "./db-add-account"
import {
    AccountModel,
    AddAccountModel,
    Hasher,
    LoadAccountByEmailRepository,
    AddAccountRepository,
} from "./db-add-account-protocols"

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(value: string): Promise<string> {
            value

            return new Promise((resolve) => resolve("hashed_value"))
        }
    }

    return new HasherStub()
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<AccountModel> {
            email

            return new Promise((resolve) => resolve(null as unknown as AccountModel))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
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
    email: "valid_name@mail.com",
    password: "valid password",
})

type SutTypes = {
    sut: DbAddAccount
    hashSpyStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const hashSpyStub = makeHasher()

    const addAccountRepositoryStub = makeAddAccountRepository()

    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()

    const sut = new DbAddAccount(hashSpyStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

    return {
        sut,
        hashSpyStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub,
    }
}

describe("DBAccount Use case", () => {
    test("Should call Hasher with correct password", async () => {
        const {sut, hashSpyStub} = makeSut()

        const hashSpy = jest.spyOn(hashSpyStub, "hash")

        await sut.add(makeFakeAccountData())

        expect(hashSpy).toHaveBeenCalledWith("valid password")
    })

    test("Should throw if Hasher throws", async () => {
        const {sut, hashSpyStub} = makeSut()

        jest.spyOn(hashSpyStub, "hash").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.add(makeFakeAccountData())

        await expect(promise).rejects.toThrow()
    })

    test("Should call AddAccountRepository with correct values", async () => {
        const {sut, addAccountRepositoryStub} = makeSut()

        const addSpy = jest.spyOn(addAccountRepositoryStub, "add")

        await sut.add(makeFakeAccountData())

        expect(addSpy).toBeCalledWith({
            name: "valid name",
            email: "valid_name@mail.com",
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

    test("Should return null if LoadAccountByEmailRepository not returns null", async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()

        jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockReturnValueOnce(
            new Promise((resolve) => resolve(makeFakeAccount()))
        )

        const account = await sut.add(makeFakeAccountData())

        expect(account).toEqual(null)
    })

    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const {loadAccountByEmailRepositoryStub, sut} = makeSut()

        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")

        await sut.add(makeFakeAccountData())

        expect(loadSpy).toHaveBeenCalledWith("valid_name@mail.com")
    })
})
