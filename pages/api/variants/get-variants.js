import { 
    connectDatabase, 
    findDocumentsByQueryObject 
} from '../../../utils/mongo-utils'

export default async function handler(req, res) {
    try {
        const client = await connectDatabase()
        const { syncProductId, color, size } = req.query
        const variantQuery = {
            syncProductId: +syncProductId,
            'color.color_code': `#${color}`,
            size
        }
        const productQuery = {
            syncProductId: +syncProductId
        }
        const variant = await findDocumentsByQueryObject(client, 'variants', variantQuery)
        const product = await findDocumentsByQueryObject(client, 'products', productQuery)
        const productColors = product[0].colors
        const productSizes = product[0].sizes
        const response = {
            variant: variant[0],
            productColors,
            productSizes
        }

        res.status(200).json(response)

    } catch(error){
        console.log('there was an error getting variants from mongo', error)
        res.status(400).json(error)
    }
}