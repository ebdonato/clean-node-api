import {
    CompareFieldsValidation,
    RequiredFieldValidation,
    EmailValidation,
    ValidationComposite,
} from "../../../../validation/validators"
import {Validation} from "../../../../presentation/protocols"
import {EmailValidator} from "../../../../validation/protocols/emailValidator"
import {makeSignupValidation} from "./signup-validation-factory"

jest.mock("../../../../validation/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return !!email
        }
    }

    return new EmailValidatorStub()
}

describe("SignUpValidation Factory", () => {
    test("Should call ValidationComposite with all validations", () => {
        makeSignupValidation()

        const validations: Validation[] = []

        for (const field of ["name", "email", "password", "passwordConfirmation"]) {
            validations.push(new RequiredFieldValidation(field))
        }

        validations.push(new CompareFieldsValidation("password", "passwordConfirmation"))

        validations.push(new EmailValidation("email", makeEmailValidator()))

        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
