import {Collection, MongoClient, MongoClientOptions} from "mongodb"

export const MongoHelper = {
    connection: null as unknown as MongoClient,

    url: null as unknown as string,

    async connect(url: string): Promise<void> {
        this.connection = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as MongoClientOptions)

        this.url = url
    },

    async disconnect(): Promise<void> {
        this.connection && (await this.connection.close())
        this.connection = null as unknown as MongoClient
    },

    async getCollection(name: string): Promise<Collection> {
        if (!this.connection?.isConnected()) {
            await this.connect(this.url)
        }

        return this.connection.db().collection(name)
    },

    map(doc: any): any {
        const {_id, ...docWithoutId} = doc

        return Object.assign({}, docWithoutId, {id: _id})
    },
}
