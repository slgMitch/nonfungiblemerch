import axios from 'axios'

export async function getStoreProducts() {
    try {
        const { data } = await axios.get('https://api.printful.com/store/products', {
            headers: {
                'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
            },
        });
        return data;
    } catch(error) {
        return error
    }
}

export async function getStoreProductById(productId) {
    try {
        const { data } = await axios.get(`https://api.printful.com/store/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
            },
        });
        return data;
    } catch(error) {
        return error
    }
}

export async function createStoreProduct(productDetails) {
    try {
        const { data } = await axios.post('https://api.printful.com/store/products', productDetails, {
            headers: {
                'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
                'content-type': 'application/json',
            },
        });
        return data;
    } catch(error) {
        return error
    }
}

export async function updateStoreProduct(productId, productDetails) {
    try {
        const { data } = await axios.put(`https://api.printful.com/store/products/${productId}`, productDetails, {
            headers: {
                'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
                'content-type': 'application/json',
            },
        });
        return data;
    } catch(error) {
        return error
    }
}

export function generatePrintfulRequest(data) {
    let syncVariants = data.variantIds.map((id) => ({
        variant_id: id,
        files: [
            {
                type: data.imagePlacement,
                url: data.imageUrl
            }
        ],
        options: []
    }))
    
    if(syncVariants.length > 100) {
        syncVariants = syncVariants.slice(0,100)
    }
    
    let printfulRequest = {
        sync_product: {
            name: data.merchName
        },
        sync_variants: syncVariants
    }

    return JSON.stringify(printfulRequest)
}

export async function findVariantFileWitPreview(id) {
    try {
        let variantFileWithPreview
    
        while(!variantFileWithPreview) {
            const getProductResponse = await getStoreProductById(id)
            console.log('getProductResponse sync_variants', getProductResponse.result.sync_variants)
            const getProductSyncVariants = getProductResponse.result.sync_variants
            variantFileWithPreview = getProductSyncVariants.find(variant => variant.files.find(file => file.type === 'preview' && file.preview_url !== null))
        }
    
        const previewFile = variantFileWithPreview.files.find(file => file.type === 'preview')
        return previewFile.preview_url

    } catch(error) {
        return error
    }
}