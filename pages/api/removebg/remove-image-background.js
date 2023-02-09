import { removeBackgroundFromImageUrl } from 'remove.bg';
import { S3 } from 'aws-sdk';
import path from 'path';
import fs from 'fs/promises';
import btoa from 'btoa';

export default async function handler(req, res) {
    // console.log('removing image background', req.body)
    const { imageUrl, imageId } = JSON.parse(req.body);

    try {
        const outputFile = path.join(process.cwd(), 'images', `${imageId}.png`)
        const newImage = await removeBackgroundFromImageUrl({
            url: imageUrl,
            apiKey: process.env.REMOVEBG_API_KEY,
            size: "regular",
            type: "auto", 
            outputFile
        })
        
        const s3 = new S3({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        });

        const fileContent = await fs.readFile(outputFile)

        const params = {
            Bucket: process.env.S3_IMAGE_BUCKET,
            Key: `no-background/${imageId}.jpg`,
            Body: fileContent
        }

        s3.upload(params, async function(err, data) {
            if(err) {
                throw err;
            }
            const deleteFile = await fs.rm(outputFile);
            const bucketOptions = {
                bucket: process.env.S3_IMAGE_BUCKET,
                key: `no-background/${imageId}.jpg`
            }
            const stringRequest = JSON.stringify(bucketOptions)
            const encRequest = btoa(stringRequest)
            
            const cdnUrl = `${process.env.CDN_API_BASE}/${encRequest}`
            console.log('cdnUrl', cdnUrl)
            res.status(200).json(cdnUrl)
        })

        
    } catch(error) {
        console.log('there was an error', error)
        res.status(400).json(error)
    }
}