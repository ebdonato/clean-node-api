import "module-alias/register"

import {MongoHelper} from "@/infra/db/mongodb/helpers/mongodb-helper"

import env from "@/main/config/env"

const connectionString = env.mongoURL

const port = env.port

MongoHelper.connect(connectionString)
    .then(async () => {
        const app = (await import("./config/app")).default

        app.listen(port, () => console.log(`Server is running at port ${port}`))
    })
    .catch(console.error)
