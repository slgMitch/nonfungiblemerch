import { MaxKey } from 'mongodb'
import { 
    connectDatabase, 
    findDocumentsByQueryObject
} from '../../../utils/mongo-utils'

export default async function handler(req, res) {
    try {
        const client = await connectDatabase()
        const query = { 
            $or: [ 
                { productCategory: 'PILLOWS' }, 
                { productCategory: 'CASES' }, 
                { productCategory: 'BAGS' }
            ] 
        }
        
        const accessories = await findDocumentsByQueryObject(client, 'products', query)
        let tokenNames = []
        let tokenCollections = []
        let colors = []
        let prices = []
        let categories = []
        for (let accessory of accessories) {
            tokenNames.push(accessory.tokenData.tokenName)
            tokenCollections.push(accessory.tokenData.tokenCollection)
            colors = [
                ...colors,
                ...accessory.colors
            ]
            prices.push({ maxPrice: accessory.maxPrice, minPrice: accessory.minPrice })
            categories.push(accessory.productCategory)
        }
        
        const filters = {
            tokenNames: Array.from(new Set(tokenNames)),
            tokenCollections: Array.from(new Set(tokenCollections)),
            colors: colors.filter((value, index, self) => index === self.findIndex((t)  => ( t.colorCode === value.colorCode && t.color === value.color))),
            prices: { maxPrice: Math.max(...prices.map(price => price.maxPrice)), minPrice: Math.min(...prices.map(price => price.minPrice)) },
            categories: Array.from(new Set(categories))
        }
        // console.log('filters', filters)
        // console.log('accessories', accessories)
        res.status(200).json({ accessories, filters })


    } catch(error) {
        console.log('there was an error', error)
        res.status(400).json(error)
    }
}