import { 
    createStoreProduct, 
    updateStoreProduct, 
    generatePrintfulRequest, 
    getVariantPreviewImages
} from '../../../utils/printful-utils'

import { 
    connectDatabase, 
    insertDocument,
    insertDocuments,
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
        // console.log('variantPreviewImages', variantPreviewImages)
        const lastVariant = variantPreviewImages.sync_variants[variantPreviewImages.sync_variants.length - 1]
        const previewFileUrl = lastVariant.files[1].preview_url
        // const previewFileUrl = lastVariant.files[1].thumbnail_url
        
        const updatedProductJson = JSON.parse(printfulData)
        updatedProductJson.sync_product.thumbnail = previewFileUrl
        const updatedProductData = JSON.stringify(updatedProductJson)
        
        await updateStoreProduct(id, updatedProductData)

        // need to add availability options
        const { product, productVariants } = generateMongoProductData(reqData, variantPreviewImages) 
        // console.log('product', product)
        // console.log('productVariants', productVariants)
    
        const mongoProduct = await insertDocument(client, 'products', product)
        const mongoVariants = await insertDocuments(client, 'variants', productVariants)
    
        res.status(200).json({ mongoProduct, mongoVariants })
        client.close()
    } catch(error) {
        console.log('there was an error', error)
        res.status(400).json(error)
    }

}

