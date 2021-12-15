export class UnauthorizedError extends Error {
    constructor() {
        super("Unauthorized User Error")

        this.name = "UnauthorizedError"
    }
}
