import {InvalidParamError} from "../../errors"
import {Validation} from "../../protocols/validation"

export class CompareFieldsValidation implements Validation {
    private readonly fieldName
    private readonly fieldNameToCompare

    constructor(fieldName: string, fieldNameToCompare: string) {
        this.fieldName = fieldName
        this.fieldNameToCompare = fieldNameToCompare
    }

    validate(input: any): Error {
        if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
            return new InvalidParamError(this.fieldNameToCompare)
        }

        return null as unknown as Error
    }
}
