import {Collection, MongoClient, MongoClientOptions} from "mongodb"

export const MongoHelper = {
    connection: null as unknown as MongoClient,

    async connect(url: string): Promise<void> {
        this.connection = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as MongoClientOptions)
    },

    async disconnect(): Promise<void> {
        await this.connection.close()
    },

    getCollection(name: string): Collection {
        return this.connection.db().collection(name)
    },

    map: (doc: any): any => {
        const {_id, ...docWithoutId} = doc

        return Object.assign({}, docWithoutId, {id: _id})
    },
}
