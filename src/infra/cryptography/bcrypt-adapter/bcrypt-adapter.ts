import {Hasher} from "../../../data/protocols/cryptography/hasher"
import bcrypt from "bcrypt"
import {HashComparer} from "../../../data/protocols/cryptography/hash-comparer"

export class BcryptAdapter implements Hasher, HashComparer {
    private readonly salt: number = 12

    constructor(salt: number) {
        this.salt = salt
    }

    async hash(value: string): Promise<string> {
        const hash = bcrypt.hash(value, this.salt)

        return hash
    }

    async compare(password: string, hash: string): Promise<boolean> {
        const compare = await bcrypt.compare(password, hash)

        return compare
    }
}
