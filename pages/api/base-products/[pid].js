import axios from 'axios';
import { connectDatabase, findDocumentsByQueryObject } from '../../../utils/mongo-utils'
import _ from 'lodash';

export default async function handler(req, res) {
    const { pid } = req.query
    const client = await connectDatabase()
    const query = {
        id: +pid
    }
    const document = await findDocumentsByQueryObject(client, 'base-products', query)
    const result = document[0]
    res.status(200).json(result)
}