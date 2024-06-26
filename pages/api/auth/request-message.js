import Moralis from 'moralis';
import { connectDatabase, getOneDocument, insertDocument } from '../../../utils/mongo-utils'
import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
    const { address, chain, network } = JSON.parse(req.body);

    const config = {
        domain: process.env.APP_DOMAIN,
        statement: 'Please sign this message to confirm your identity.',
        uri: process.env.NEXTAUTH_URL,
        timeout: 60
    };
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
    
    try {
        
        const message = await Moralis.Auth.requestMessage({
            address,
            chain,
            network,
            ...config
        });


        const client = await connectDatabase()
        const existingUser = await getOneDocument(client, 'users', { user: address })

        if(!existingUser) {
            await insertDocument(client, 'users', { user: address })
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ error });
    }
}