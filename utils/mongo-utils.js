import { MongoClient } from 'mongodb';

export async function connectDatabase() {
  const client = await MongoClient.connect(process.env.MONGO_URL);

  return client;
} 

export async function insertDocument(client, collection, document) {
  const db = client.db();

  const result = await db.collection(collection).insertOne(document);

  return result;
}

export async function insertDocuments(client, collection, documents) {
  const db = client.db();

  const result = await db.collection(collection).insertMany(documents);

  return result;
}

export async function getAllDocuments(client, collection) {
  const db = client.db();

  const documents = await db
    .collection(collection)
    .find()
    .toArray();

  return documents;
}

export async function findDocumentsByQueryObject(client, collection, queryObject) {
  const db = client.db();

  const documents = await db
  .collection(collection)
  .find(queryObject)
  .toArray();

return documents;
}

export async function getOneDocument(client, collection, documentObject) {
  const db = client.db();

  const document = await db.collection(collection).findOne(documentObject);

  return document;
}

export async function deleteCollection(client, collection) {
  const db = client.db();

  const result = await db.collection(collection).drop();

  return result;
}

export function generateMongoProductData(requestData, variantPreviewImages) {
  const { variants } = requestData.product
  const { sync_variants } = variantPreviewImages
  const updatedVariants = variants.map(variant => {
    const sync = sync_variants.find(syncVariant => syncVariant.variant_id === variant.id)
    variant.image = sync.files[1].preview_url
    variant.name = sync.name
    return variant
  })

  const colors = [...new Set(updatedVariants.map(variant => variant.color_code))]
  const sizes = [...new Set(updatedVariants.map(variant => variant.size))]
  const maxPrice = Math.max(...updatedVariants.map(variant => +variant.price))
  const minPrice = Math.min(...updatedVariants.map(variant => +variant.price))
  const productId = requestData.product.id
  const productCategory = requestData.product.category
  const tokenData = {
    tokenAddress: requestData.nftData.token_address,
    tokenName: requestData.nftData.name,
    tokenSymbol: requestData.nftData.symbol,
  }
  
  delete requestData.product
  delete requestData.imagePlacement
  delete requestData.nftData

  requestData.productId = productId
  requestData.productCategory = productCategory
  requestData.tokenData = tokenData
  requestData.imageUrl = updatedVariants[updatedVariants.length - 1].image
  requestData.colors = colors
  requestData.sizes = sizes
  requestData.maxPrice = maxPrice
  requestData.minPrice = minPrice
  requestData.variants = updatedVariants
  return requestData
}