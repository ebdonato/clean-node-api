import {Controller, HttpRequest, Validation} from "./add-survey-controller-protocols"
import {AddSurveyController} from "./add-survey-controller"

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: "any_question",
        answers: [
            {
                image: "any_image",
                answer: "any_answer",
            },
        ],
    },
})

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            input

            return null as unknown as Error
        }
    }

    return new ValidationStub()
}

interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidation()

    const sut = new AddSurveyController(validationStub)

    return {
        sut,
        validationStub,
    }
}

describe("Add Survey Controller", () => {
    test("Should call Validation with correct values", async () => {
        const {sut, validationStub} = makeSut()

        const validateSpy = jest.spyOn(validationStub, "validate")

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)

        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})