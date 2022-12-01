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
        let selectedVatiant = document[0].variants[document[0].variants.length - 1]
        const colorOptions = [...new Set(document[0].variants.map(variant => variant.color))]
        const sizeOptions = [...new Set(document[0].variants.map(variant => variant.size))]
        const availabilityStatus = document[0].variants[document[0].variants.length - 1].availability_status.find((status) => status.region === 'US')
        selectedVatiant._id = document[0]._id
        const response = {
            selectedVatiant,
            colorOptions,
            sizeOptions,
            availabilityStatus
        }
        res.status(200).json(response)
        client.close()
    } catch(error) {
        console.log('there was an error getting  product by id from mango', error)
        res.status(400).json(error)
    }

}