import { 
    createStoreProduct, 
    updateStoreProduct, 
    generatePrintfulRequest, 
    findVariantFileWitPreview
} from '../../../utils/printful-utils'

import { connectDatabase, insertDocument } from '../../../utils/mongo-utils'


export default async function handler(req, res) {
    try {
        const client = await connectDatabase()
        const reqData = JSON.parse(req.body)
        const printfulData = generatePrintfulRequest(reqData)
        const createProductResponse = await createStoreProduct(printfulData)
    
        const { id } = createProductResponse.result
    
        const previewFileUrl = await findVariantFileWitPreview(id)
    
        const updatedProductJson = JSON.parse(printfulData)
        updatedProductJson.sync_product.thumbnail = previewFileUrl
        const updatedProductData = JSON.stringify(updatedProductJson)
    
        const updateProductResponse = await updateStoreProduct(id, updatedProductData)
    
        const newMongoProductData = {
            userWalletAddress: reqData.userWalletAddress,
            productId: updateProductResponse.result.id,
            productName: updateProductResponse.result.name,
            productVariants: updateProductResponse.result.variants,
            productImageUrl: updateProductResponse.result.thumbnail_url,
            productType: reqData.productType
        }
    
        const newMongoProduct = await insertDocument(client, 'products', newMongoProductData)
    
        res.status(200).json(newMongoProduct)
        client.close()
    } catch(error) {
        console.log('there was an error', error)
        res.status(400).json(error)
    }

}

