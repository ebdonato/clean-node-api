import dotenv from "dotenv"

dotenv.config()

export default {
    mongoURL:
        process.env.MONGO_URL ||
        "mongodb://localhost:27017/clean-node-api?readPreference=primary&directConnection=true&ssl=false",
    port: process.env.PORT || "5050",
    jwtSecret: process.env.JWT_SECRET || "JWT_SECRET",
}
