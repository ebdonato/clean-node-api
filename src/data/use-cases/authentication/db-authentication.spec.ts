import {DbAuthentication} from "./db-authentication"
import {
    AccountModel,
    AuthenticationModel,
    HashComparer,
    TokenGenerator,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
} from "./db-authentication-protocols"

const makeFakeAccount = (): AccountModel => ({
    id: "any_id",
    name: "any_name",
    email: "any_mail@mail.com",
    password: "hashed_password",
})

const makeFakeAuthentication = (): AuthenticationModel => ({
    email: "any_mail@mail.com",
    password: "any_password",
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string): Promise<AccountModel> {
            email

            return new Promise((resolve) => resolve(makeFakeAccount()))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare(password: string, hash: string): Promise<boolean> {
            password

            hash

            return new Promise((resolve) => resolve(true))
        }
    }

    return new HashComparerStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
        async generate(id: string): Promise<string> {
            id

            return new Promise((resolve) => resolve("any_token"))
        }
    }

    return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        async update(id: string, token: string): Promise<void> {
            id

            token

            return new Promise((resolve) => resolve())
        }
    }

    return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    tokenGeneratorStub: TokenGenerator
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()

    const hashComparerStub = makeHashComparerStub()

    const tokenGeneratorStub = makeTokenGeneratorStub()

    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()

    const sut = new DbAuthentication(
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub
    )

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub,
    }
}

describe("DbAuthentication UseCase", () => {
    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const {loadAccountByEmailRepositoryStub, sut} = makeSut()

        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load")

        await sut.auth(makeFakeAuthentication())

        expect(loadSpy).toHaveBeenCalledWith("any_mail@mail.com")
    })

    test("Should throw with if LoadAccountByEmailRepository throws", async () => {
        const {loadAccountByEmailRepositoryStub, sut} = makeSut()

        jest.spyOn(loadAccountByEmailRepositoryStub, "load").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const promise = sut.auth(makeFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })

    test("Should return null if LoadAccountByEmailRepository returns null", async () => {
        const {loadAccountByEmailRepositoryStub, sut} = makeSut()

        jest.spyOn(loadAccountByEmailRepositoryStub, "load").mockReturnValueOnce(
            new Promise((resolve) => resolve(null as unknown as AccountModel))
        )

        const accessToken = await sut.auth(makeFakeAuthentication())

        expect(accessToken).toBeNull()
    })

    test("Should call HashComparer with correct values", async () => {
        const {hashComparerStub, sut} = makeSut()

        const compareSpy = jest.spyOn(hashComparerStub, "compare")

        await sut.auth(makeFakeAuthentication())

        expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password")
    })

    test("Should throw with if HashComparer throws", async () => {
        const {hashComparerStub, sut} = makeSut()

        jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const promise = sut.auth(makeFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })

    test("Should return null if HashComparer returns false", async () => {
        const {hashComparerStub, sut} = makeSut()

        jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(new Promise((resolve) => resolve(false)))

        const accessToken = await sut.auth(makeFakeAuthentication())

        expect(accessToken).toBeNull()
    })

    test("Should call TokenGenerator with correct id", async () => {
        const {tokenGeneratorStub, sut} = makeSut()

        const generateSpy = jest.spyOn(tokenGeneratorStub, "generate")

        await sut.auth(makeFakeAuthentication())

        expect(generateSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should throw with if TokenGenerator throws", async () => {
        const {tokenGeneratorStub, sut} = makeSut()

        jest.spyOn(tokenGeneratorStub, "generate").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const promise = sut.auth(makeFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })

    test("Should returns an access token on success", async () => {
        const {sut} = makeSut()

        const accessToken = await sut.auth(makeFakeAuthentication())

        expect(accessToken).toEqual("any_token")
    })

    test("Should call UpdateAccessTokenRepository with correct values", async () => {
        const {updateAccessTokenRepositoryStub, sut} = makeSut()

        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "update")

        await sut.auth(makeFakeAuthentication())

        expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token")
    })

    test("Should throw with if UpdateAccessTokenRepository throws", async () => {
        const {updateAccessTokenRepositoryStub, sut} = makeSut()

        jest.spyOn(updateAccessTokenRepositoryStub, "update").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const promise = sut.auth(makeFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })
})
