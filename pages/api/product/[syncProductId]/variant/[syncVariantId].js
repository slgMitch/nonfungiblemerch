import { 
    connectDatabase, 
    findDocumentsByQueryObject 
} from '../../../../../utils/mongo-utils'

export default async function handler(req, res) {
    const client = await connectDatabase()
    const { syncProductId, syncVariantId } = req.query
    console.log('{ syncProductId, syncVariantId }', { syncProductId, syncVariantId })
    
    const productsQuery = {
        syncProductId: +syncProductId 
    }

    const variantQuery = {
        syncProductId: +syncProductId,
        syncVariantId: +syncVariantId
    }

    console.log('variantQuery', variantQuery)

    const products = await findDocumentsByQueryObject(client, 'variants', productsQuery)
    const variant = await findDocumentsByQueryObject(client, 'variants', variantQuery)

    res.status(200).json({ products, variant })
}