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