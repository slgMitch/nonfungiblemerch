import { 
    connectDatabase, 
    findDocumentsByQueryObject 
} from '../../../../../utils/mongo-utils'

export default async function handler(req, res) {
    const client = await connectDatabase()
    const { syncProductId, syncVariantId } = req.query
    
    const productsQuery = {
        syncProductId: +syncProductId 
    }

    const variantQuery = {
        syncProductId: +syncProductId,
        syncVariantId: +syncVariantId
    }
    
    const products = await findDocumentsByQueryObject(client, 'variants', productsQuery)
    const variant = await findDocumentsByQueryObject(client, 'variants', variantQuery)
    
    const baseProductQuery = {
        syncProductId: +variant[0].syncProductId
    }
    
    const baseProduct = await findDocumentsByQueryObject(client, 'products', baseProductQuery)

    const productColors = baseProduct[0].colors
    const productSizes = baseProduct[0].sizes

    res.status(200).json({ products, variant, productColors, productSizes })
}