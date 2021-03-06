import {DbLoadSurveys} from "./db-load-surveys"
import {LoadSurveysRepository} from "@/data/protocols/db/survey/load-surveys-repository"
import {SurveyModel} from "@/domain/models/survey"
import MockDate from "mockdate"

const makeFakeSurveys = (): SurveyModel[] => {
    return [
        {
            id: "any_id",
            question: "any_question",
            answers: [
                {
                    image: "any_image",
                    answer: "any_answer",
                },
            ],
            date: new Date(),
        },
        {
            id: "other_id",
            question: "other_question",
            answers: [
                {
                    image: "other_image",
                    answer: "other_answer",
                },
            ],
            date: new Date(),
        },
    ]
}

type SutTypes = {
    sut: DbLoadSurveys
    loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
        async loadAll(): Promise<SurveyModel[]> {
            return new Promise((resolve) => resolve(makeFakeSurveys()))
        }
    }

    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()

    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

    return {
        sut,
        loadSurveysRepositoryStub,
    }
}

describe("DbLoadSurveys", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test("Should call LoadSurveysRepository", async () => {
        const {sut, loadSurveysRepositoryStub} = makeSut()

        const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll")

        await sut.load()

        expect(loadAllSpy).toHaveBeenCalled()
    })

    test("Should call return a list of surveys on success", async () => {
        const {sut} = makeSut()

        const surveys = await sut.load()

        expect(surveys).toEqual(makeFakeSurveys())
    })

    test("Should throws if LoadSurveysRepository throws", async () => {
        const {sut, loadSurveysRepositoryStub} = makeSut()

        jest.spyOn(loadSurveysRepositoryStub, "loadAll").mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const promise = sut.load()

        expect(promise).rejects.toThrow()
    })
})
