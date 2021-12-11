import {MongoHelper} from "../infra/db/mongodb/helpers/mongodb-helper"
import dotenv from "dotenv"

dotenv.config()

const connectionString =
    process.env.MONGO_URL ||
    "mongodb://localhost:27017clean-node-api?readPreference=primary&directConnection=true&ssl=false"

const port = process.env.PORT || 5050

MongoHelper.connect(connectionString)
    .then(async () => {
        const app = (await import("./config/app")).default

        app.listen(port, () => console.log("Server is running at http://localhost:5050"))
    })
    .catch(console.error)
