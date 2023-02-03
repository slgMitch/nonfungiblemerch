import { 
    connectDatabase, 
    findDocumentsByQueryObject 
} from '../../../utils/mongo-utils'

export default async function handler(req, res) {
    try {
        const client = await connectDatabase()
        let { syncProductId, color, size } = req.query
        if (/\d/.test(size)) {
            console.log('has a number', size)
            const subA = size.substr(0,2)
            const subB = size.substr(3,4)
            console.log('has a subA', subA)
            console.log('has a subB', subB)
            size = `${subA}″x${subB}″`
        }
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