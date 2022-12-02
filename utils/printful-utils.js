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
        console.log('there was an error in createStoreProduct', error)
        throw new Error(error)
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
    // console.log('data variants', data)
    // console.log('data file_placement_options', data.product.file_placement_options)
    let syncVariants = data.product.variants.map((variant) => ({
        variant_id: variant.id,
        retail_price: calculateRetailPrice(variant, data.product.file_placement_options, data.imagePlacement),
        files: [
            {
                type: data.imagePlacement,
                url: data.imageUrl
            }
        ],
        options: [] // dynamically generate based off of imagePlacement
    }))
    
    let printfulRequest = {
        sync_product: {
            name: data.merchName
        },
        sync_variants: syncVariants
    }

    return JSON.stringify(printfulRequest)
}

function calculateRetailPrice(variant, filePlacementOptions, imagePlacement) {
    const filePlacementOption = filePlacementOptions.find(placement => placement.id === imagePlacement)
    const retailPrice = (+variant.price + +filePlacementOption.additional_price + ((+variant.price + +filePlacementOption.additional_price) * .4)).toFixed(2)
    const retailPriceString = retailPrice.toString()

    return retailPriceString
}

export async function getVariantPreviewImages(id) {
    try {
        let productWithPreviews, runLoop = true
    
        while(runLoop === true) {
            const getProductResponse = await getStoreProductById(id)
            const getProductSyncVariants = getProductResponse.result.sync_variants
            const variantsWithPreview = handleVariants(getProductSyncVariants)
            if(variantsWithPreview.length == getProductSyncVariants.length) {
                const { result } = getProductResponse
                productWithPreviews = result
                runLoop = false
            }
        }
        return productWithPreviews

    } catch(error) {
        return error
    }
}

function handleVariants(variants) {
    let variantsWithPreview = []
    for(let variant of variants) {
        if(variant.files[1] && variant.files[1].type === 'preview' && variant.files[1].status === 'ok') {
            variantsWithPreview.push(variant)
        } 
    }
    return variantsWithPreview
}