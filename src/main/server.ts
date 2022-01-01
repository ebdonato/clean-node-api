import {MongoHelper} from "../infra/db/mongodb/helpers/mongodb-helper"

import env from "./config/env"

const connectionString = env.mongoURL

const port = env.port

MongoHelper.connect(connectionString)
    .then(async () => {
        const app = (await import("./config/app")).default

        app.listen(port, () => console.log("Server is running at http://localhost:5050"))
    })
    .catch(console.error)
