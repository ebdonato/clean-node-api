import {Encrypter} from "../../data/protocols/encrypter"
import bcrypt from "bcrypt"

export class BcryptAdapter implements Encrypter {
    private readonly salt: number = 12

    constructor(salt: number) {
        this.salt = salt
    }

    async encrypt(value: string): Promise<string> {
        const hash = bcrypt.hash(value, this.salt)

        return hash
    }
}