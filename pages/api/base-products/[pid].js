import axios from 'axios';
import _ from 'lodash';

export default async function handler(req, res) {
    const { pid } = req.query
    const url = `https://api.printful.com/products/${pid}`

    const { data } = await axios.get(url, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
        }
    })

    const { result } = data

    res.status(200).json(result)
}