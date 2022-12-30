import { removeBackgroundFromImageUrl } from 'remove.bg';
import { S3 } from 'aws-sdk';
import btoa from 'btoa';

import { 
    connectDatabase, 
    insertDocuments,
    findDocumentsByQueryObject 
} from '../../../../utils/mongo-utils'

export default async function handler(req, res) {
        const client = await connectDatabase()
        const body = JSON.parse(req.body)
        const { nfts, user, removeImageBackgrounds } = body
        let tokensToSave = []
        if(removeImageBackgrounds) {
            const s3 = new S3({
                accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
            });
            for(let nft of nfts) {
                nft.user = user
                tokensToSave.push(nft)

                const imageData = {
                    url: nft.metadata.image,
                    tokenId: nft.token_id,
                    tokenSymbol: nft.symbol
                }

                const newImage = await removeBackgroundFromImageUrl({
                    url: imageData.url,
                    apiKey: process.env.REMOVEBG_API_KEY,
                    size: "regular",
                    type: "auto"
                })

                const imageBuffer = Buffer.from(newImage.base64img, 'base64')
    
                const params = {
                    Bucket: process.env.S3_IMAGE_BUCKET,
                    Key: `no-background/${imageData.tokenSymbol}-${imageData.tokenId}.jpg`,
                    Body: imageBuffer,
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg'
                }

                s3.putObject(params, function(err, data) {
                    if(err) {
                        throw err;
                    }
                })
                const bucketOptions = {
                    bucket: process.env.S3_IMAGE_BUCKET,
                    key: `no-background/${imageData.tokenSymbol}-${imageData.tokenId}.jpg`
                }
                const stringRequest = JSON.stringify(bucketOptions)
                const encRequest = btoa(stringRequest)
                
                const cdnUrl = `${process.env.AWS_CDN_API_BASE}/${encRequest}`

                let nftWithNoBackground = {
                    ...nft,
                    metadata: {
                        ...nft.metadata
                    }
                } 
                nftWithNoBackground.metadata.image = cdnUrl
                nftWithNoBackground.metadata.name = `${nftWithNoBackground.metadata.name} - No Background`
                nftWithNoBackground.token_id = `${nftWithNoBackground.token_id}-noBG`
    
                tokensToSave.push(nftWithNoBackground)
            }
        } else {
            for(let nft of nfts) {
                nft.user = user
            }
            tokensToSave = nfts
        }

        await insertDocuments(client, 'nfts', tokensToSave)
        
        const queryObject = { user }
        const userNfts = await findDocumentsByQueryObject(client, 'nfts', queryObject)

        res.status(200).json(userNfts)
}