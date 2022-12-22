import { connectDatabase, findDocumentsByQueryObject } from '../../../../utils/mongo-utils'

export default async function handler(req, res) {
    const { user } = req.query
    console.log('the user', user)
    const client = await connectDatabase()
    const queryObject = {
        user
    }

    const userData = await findDocumentsByQueryObject(client, 'users', queryObject)
    const nfts = userData.nfts ? userData.nfts : []
    console.log('users nfts', nfts)

    res.status(200).json(nfts)
}