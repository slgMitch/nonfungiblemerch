import { useState, useEffect } from 'react'
import { 
    Grid,
    Typography,
    Backdrop,
    CircularProgress
  } from '@mui/material'
import useSWR from 'swr'

export default function Products(props) {
    const { user } = props
    console.log('the user', user)
    const fetcher = (url) => fetch(url).then((res) => res.json())
    const url = `/api/profile/products/${user}`
    const { data, error } = useSWR(url, fetcher)
    const [products, setProducts] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        console.log('products data', data)
        setIsLoading(true)
        setProducts(data)
        setIsLoading(false)
    }, [data])

    if(!data || !products || isLoading) {
        return (
            <Backdrop
                open={!products || isLoading}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }



    return (
        <Grid container direction="row" sx={{ border: '5px solid black'}}>
            <Grid item xs={12}>
                <Typography variant="h3" textAlign='center'>My Products</Typography>
            </Grid>
        </Grid>
    )
}