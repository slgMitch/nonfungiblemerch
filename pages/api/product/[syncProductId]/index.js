import { 
    connectDatabase, 
    findDocumentsByQueryObject 
} from '../../../../utils/mongo-utils'

export default async function handler(req, res) {
    const client = await connectDatabase()
    const { syncProductId } = req.query
    
    const query = {
        syncProductId: +syncProductId 
    }
    const document = await findDocumentsByQueryObject(client, 'variants', query)
    res.status(200).json(document)
}