import {InvalidParamError} from "../../errors"
import {EmailValidator} from "../../protocols"
import {EmailValidation} from "./email-validation"

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return !!email
        }
    }

    return new EmailValidatorStub()
}

interface SutTypes {
    sut: EmailValidation
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()

    const sut = new EmailValidation("email", emailValidatorStub)

    return {
        sut,
        emailValidatorStub,
    }
}

describe("Email Validation", () => {
    test("Should return an error if EmailValidator returns false", () => {
        const {sut, emailValidatorStub} = makeSut()

        jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)

        const error = sut.validate({email: "any_name@mail.com"})

        expect(error).toEqual(new InvalidParamError("email"))
    })

    test("Should call EmailValidator with correct mail", () => {
        const {sut, emailValidatorStub} = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")

        sut.validate({email: "any_name@mail.com"})

        expect(isValidSpy).toHaveBeenCalledWith("any_name@mail.com")
    })

    test("Should throw if EmailValidator throws", async () => {
        const {sut, emailValidatorStub} = makeSut()

        jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
            throw new Error()
        })

        expect(sut.validate).toThrow()
    })
})
