import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';

export default async function handler(req, res) {
    const { address } = JSON.parse(req.body);

    const chain = EvmChain.ETHEREUM;

    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

    try {
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain,
        });


        const { result } = response.data
        const tokens = []
        result.forEach(token => {
            // need to figure out what NFTs have been added to the database
            if(token.metadata !== null) {
                const parsedMetadata = JSON.parse(token.metadata)
                token.metadata = parsedMetadata
                if(token.metadata.image.includes('ipfs://')) {
                    const imageUri = token.metadata.image.split('//').pop()
                    token.metadata.image = `https://ipfs.io/ipfs/${imageUri}`
                }
                tokens.push(token) 
            } 
        });
        res.status(200).json(tokens)
    } catch(error) {
        res.status(400).json({ error })
    }
}