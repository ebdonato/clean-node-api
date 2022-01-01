import {Express, Router} from "express"
import {readdirSync} from "fs"

export default (app: Express): void => {
    const router = Router()

    app.use("/api", router)

    readdirSync(`${__dirname}/../routes`).map(async (file) => {
        if (!file.includes(".test.")) {
            const importedFile = await import(`../routes/${file}`)

            importedFile.default(router)
        }
    })
}
