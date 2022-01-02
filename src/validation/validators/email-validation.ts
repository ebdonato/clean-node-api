import {EmailValidatorAdapter} from "../../infra/validators/email-validator-adapter"
import {InvalidParamError} from "../../presentation/errors"
import {Validation} from "../../presentation/protocols"

export class EmailValidation implements Validation {
    constructor(private readonly fieldName: string, private readonly emailValidator: EmailValidatorAdapter) {}

    validate(input: any): Error {
        if (!this.emailValidator.isValid(input[this.fieldName])) {
            return new InvalidParamError(this.fieldName)
        }

        return null as unknown as Error
    }
}
