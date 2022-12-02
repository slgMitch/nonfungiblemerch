import axios from 'axios';
import _ from 'lodash';
import { connectDatabase, findDocumentsByQueryObject } from '../../../utils/mongo-utils'

export default async function handler(req, res) {
    const { address } = req.query;
    const client = await connectDatabase()
    const queryObject = {
        productCreator: address
    }

    const merch = await findDocumentsByQueryObject(client, 'products', queryObject)

    res.status(200).json(merch)
    
}