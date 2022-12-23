import { useState, useEffect } from 'react'
import { 
    Grid,
    Typography,
    Backdrop,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    ToggleButton,
    Tooltip,
    Button
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
        <Grid container direction="row" >
            <Grid item xs={12}>
                <Typography variant="h3" textAlign='center'>My Products</Typography>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
                <Button>Add Product</Button>
            </Grid>
            <Grid item xs={12}>
                {
                    products && products.length ? (
                        <Grid
                            container
                            spacing={3}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            {
                                products.map((product) => (
                                    <Grid item xs={3} key={product._id}>
                                        <Card
                                            key={product._id}
                                            sx={{
                                                height: '800px'
                                            }}
                                        >
                                            <CardMedia 
                                                component='img'
                                                image={product.imagePreviewUrl}
                                                alt={product.name}
                                            />
                                            <CardContent>
                                                <Typography noWrap gutterBottom component="div">
                                                    {product.name}
                                                </Typography>
                                                <Typography noWrap gutterBottom component="div">
                                                    Project: { product.tokenData.tokenName}
                                                </Typography>
                                                <br />
                                                <Grid item xs={12}>
                                                    Colors: {product.colors.map((color) => (
                                                        <Tooltip key={color.colorCode} title={color.color}>
                                                            <ToggleButton key={color.colorCode} value={color.colorCode} style={{ backgroundColor: `${color.colorCode}`, margin: '2px', padding: '15px'}}></ToggleButton>
                                                        </Tooltip>
                                                    ))}
                                                </Grid>
                                                <br />
                                                <Grid item xs={12}>
                                                    Sizes: {product.sizes.map((size) => (
                                                        <ToggleButton key={size} value={size} style={{margin: '2px'}}>{size}</ToggleButton>
                                                    ))}
                                                </Grid>
                                                <br />
                                                <Typography noWrap gutterBottom component="div">
                                                    Price: ${ product.minPrice } - ${ product.maxPrice }
                                                </Typography>
                                            </CardContent>

                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    ) : (
                        <Grid 
                            container
                            direction='row'
                            justifyContent="center" 
                            alignContent="center"
                            style={{ minHeight: "100vh" }}
                        >
                            <Grid item xs={6}>
                                <Card sx={{ borderRadius: '16px', top: '50%' }}>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom textAlign="center">
                                            You don't have any Products... Start the process by clicking below!
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button>Create Products</Button>
                                    </CardActions>
                                </Card>
                            </Grid>

                        </Grid>
                    )
                }

            </Grid>
        </Grid>
    )
}