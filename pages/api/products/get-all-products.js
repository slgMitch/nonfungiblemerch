import { get } from 'lodash'
import { connectDatabase, getAllDocuments } from '../../../utils/mongo-utils'
import { createApparelObject } from '../../../utils/helpers'
export default async function handler(req, res) {
    try {
        const client = await connectDatabase()
        const document = await getAllDocuments(client, 'products')
        const apparel = createApparelObject(document)
        // res.status(200).json(apparel)
        client.close()
    } catch(error) {
        console.log('there was an error getting all products from mango', error)
        res.status(200400).json(error)
    }

}