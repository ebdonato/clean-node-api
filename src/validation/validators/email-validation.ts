import {EmailValidator} from "@/validation/protocols/emailValidator"
import {Validation} from "@/presentation/protocols"
import {InvalidParamError} from "@/presentation/errors"

export class EmailValidation implements Validation {
    constructor(private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}

    validate(input: any): Error {
        if (!this.emailValidator.isValid(input[this.fieldName])) {
            return new InvalidParamError(this.fieldName)
        }

        return null as unknown as Error
    }
}
