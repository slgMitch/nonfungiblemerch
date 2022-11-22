import { connectDatabase, findDocumentsByQueryObject } from '../../../utils/mongo-utils'
import { createApparelObject } from '../../../utils/helpers'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
    try {
        const { apparelId } = req.query
        const id = ObjectId(apparelId)
        const query = { _id: id };
        const client = await connectDatabase()
        const document = await findDocumentsByQueryObject(client, 'products', query)
        res.status(200).json(document[0])
        client.close()
    } catch(error) {
        console.log('there was an error getting  product by id from mango', error)
        res.status(400).json(error)
    }

}