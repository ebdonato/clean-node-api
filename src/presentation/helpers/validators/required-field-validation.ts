import {MissingParamError} from "../../errors"
import {Validation} from "../../protocols/validation"

export class RequiredFieldValidation implements Validation {
    private readonly fieldName

    constructor(fieldName: string) {
        this.fieldName = fieldName
    }

    validate(input: any): Error {
        if (!input[this.fieldName]) {
            return new MissingParamError(this.fieldName)
        }

        return null as unknown as Error
    }
}
