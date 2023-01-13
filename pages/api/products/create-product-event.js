import axios from 'axios'

export default async function handler(req, res) {
    const reqBody = JSON.parse(req.body)
    console.log('reqBody', reqBody)
    try {
        const { data } = await axios.post(`${process.env.CREATE_PRODUCT_EVENT_URL}`, reqBody, {
            headers: {
                'content-type': 'application/json',
            },
        })
        console.log('craete product response data', data)
        res.status(200).json({message: 'success'})
    } catch(error) {
        console.log('craete product response error', error)
        res.status(400).json(error)
    }
}