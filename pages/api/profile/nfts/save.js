import { 
    connectDatabase, 
    insertDocuments,
    findDocumentsByQueryObject 
} from '../../../../utils/mongo-utils'

export default async function handler(req, res) {
        const client = await connectDatabase()
        const body = JSON.parse(req.body)
        const { nfts, user } = body
        for(const nft of nfts) {
            nft.user = user
        }
        const document = nfts
        
        const savedNfts = await insertDocuments(client, 'nfts', document)
        
        const queryObject = {
            user
        }
        
        const userNfts = await findDocumentsByQueryObject(client, 'nfts', queryObject)
        console.log('the userNfts', userNfts)

    
        res.status(200).json(userNfts)
}