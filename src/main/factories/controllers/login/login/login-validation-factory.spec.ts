import {makeLoginValidation} from "./login-validation-factory"
import {EmailValidation, RequiredFieldValidation, ValidationComposite} from "@/validation/validators"
import {EmailValidator} from "@/validation/protocols/emailValidator"
import {Validation} from "@/presentation/protocols"

jest.mock("../../../../../validation/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return !!email
        }
    }

    return new EmailValidatorStub()
}

describe("LoginValidation Factory", () => {
    test("Should call ValidationComposite with all validations", () => {
        makeLoginValidation()

        const validations: Validation[] = []

        for (const field of ["email", "password"]) {
            validations.push(new RequiredFieldValidation(field))
        }

        validations.push(new EmailValidation("email", makeEmailValidator()))

        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
