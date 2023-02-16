import Moralis from 'moralis';
import { connectDatabase, getOneDocument, insertDocument } from '../../../utils/mongo-utils'

export default async function handler(req, res) {
    try {
        const { address, chain, network } = JSON.parse(req.body);
    
        // const config = {
        //     domain: process.env.APP_DOMAIN,
        //     statement: 'Please sign this message to confirm your identity.',
        //     uri: process.env.NEXTAUTH_URL,
        //     timeout: 60,
        // };
        
        // await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
        
        // const message = await Moralis.Auth.requestMessage({
        //     address,
        //     chain,
        //     network,
        //     ...config
        // });


        // const client = await connectDatabase()
        // const existingUser = await getOneDocument(client, 'users', { user: address })

        // if(!existingUser) {
        //     await insertDocument(client, 'users', { user: address })
        // }

        res.status(200).json({ address, chain, network });
    } catch (error) {
        console.log('there was an error in request message', error)
        res.status(400).json(error);
    }
}