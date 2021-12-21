import {EmailValidatorAdapter} from "../../../utils/email-validator-adapter"
import {InvalidParamError} from "../../errors"
import {EmailValidator} from "../../protocols"
import {Validation} from "./validation"

export class EmailValidation implements Validation {
    private readonly fieldName
    private readonly emailValidator: EmailValidator

    constructor(fieldName: string, emailValidator: EmailValidatorAdapter) {
        this.fieldName = fieldName
        this.emailValidator = emailValidator
    }

    validate(input: any): Error {
        if (!this.emailValidator.isValid(input[this.fieldName])) {
            return new InvalidParamError(this.fieldName)
        }

        return null as unknown as Error
    }
}
