import { 
    connectDatabase, 
    findDocumentsByQueryObject
} from '../../../utils/mongo-utils'

export default async function handler(req, res) {
    try {
        const client = await connectDatabase()
        const query = { 
            $or: [ 
                { productCategory: 'TSHIRTS' }, 
                { productCategory: 'HOODIES' }, 
                { productCategory: 'SWEATSHIRTS' },
                { productCategory: 'PANTS' },
                { productCategory: 'SHORTS' },
            ] 
        }

        const apparel = await findDocumentsByQueryObject(client, 'products', query)
        let tokenCollections = []
        let categories = []
        for(let app of apparel) {
            tokenCollections.push(app.tokenData.tokenCollection)
            categories.push(app.productCategory)
        }

        const filters = {
            tokenCollections: Array.from(new Set(tokenCollections)),
            categories: Array.from(new Set(categories))
        }

        console.log('{ apparel, filters }', { apparel, filters })

        res.status(200).json({ apparel, filters })

    } catch(error) {
        console.log('there was an error', error)
        res.status(400).json(error)
    }
}