

export default async function handler(req, res) {
    console.log('the snipcart webhook request', req)
    res.status(200).json({message: 'Success'})
}