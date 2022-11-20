import { 
    createStoreProduct, 
    updateStoreProduct, 
    generatePrintfulRequest, 
    getVariantPreviewImages
} from '../../../utils/printful-utils'

import { 
    connectDatabase, 
    insertDocument,
    generateMongoProductData 
} from '../../../utils/mongo-utils'


export default async function handler(req, res) {
    try {
        const client = await connectDatabase()
        const reqData = JSON.parse(req.body)
        const printfulData = generatePrintfulRequest(reqData)
        const createProductResponse = await createStoreProduct(printfulData)
        
        const { id } = createProductResponse.result
        
        const variantPreviewImages = await getVariantPreviewImages(id)
        const lastVariant = variantPreviewImages.sync_variants[variantPreviewImages.sync_variants.length - 1]
        const previewFileUrl = lastVariant.files[1].preview_url
        // const previewFileUrl = lastVariant.files[1].thumbnail_url
        
        const updatedProductJson = JSON.parse(printfulData)
        updatedProductJson.sync_product.thumbnail = previewFileUrl
        const updatedProductData = JSON.stringify(updatedProductJson)
        
        await updateStoreProduct(id, updatedProductData)

        const mongoProductData = generateMongoProductData(reqData, variantPreviewImages) 
    
        const newMongoProduct = await insertDocument(client, 'products', mongoProductData)
    
        res.status(200).json(newMongoProduct)
        client.close()
    } catch(error) {
        console.log('there was an error', error)
        res.status(400).json(error)
    }

}

