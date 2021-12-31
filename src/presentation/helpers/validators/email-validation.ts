import {EmailValidatorAdapter} from "../../../utils/email-validator-adapter"
import {InvalidParamError} from "../../errors"
import {EmailValidator} from "../../protocols"
import {Validation} from "../../protocols/validation"

export class EmailValidation implements Validation {
    constructor(private readonly fieldName: string, private readonly emailValidator: EmailValidatorAdapter) {}

    validate(input: any): Error {
        if (!this.emailValidator.isValid(input[this.fieldName])) {
            return new InvalidParamError(this.fieldName)
        }

        return null as unknown as Error
    }
}
