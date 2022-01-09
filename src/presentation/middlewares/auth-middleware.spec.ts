import {AccessDeniedError} from "../errors"
import {forbiddenError} from "../helpers/http/http-helper"
import {AuthMiddleware} from "./auth-middleware"

describe("Auth Middleware", () => {
    test("Should return 403 if no x-access-token exists in header", async () => {
        const sut = new AuthMiddleware()

        const httpResponse = await sut.handle({})

        expect(httpResponse).toEqual(forbiddenError(new AccessDeniedError()))
    })
})
