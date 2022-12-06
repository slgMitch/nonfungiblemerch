import { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Grid, 
  Backdrop,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  ToggleButton,
  Tooltip
} from '@mui/material';
import useSWR from 'swr';
import { useRouter } from 'next/router';

export default function Apparel() {

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const url = `/api/products/get-all-products`;
    const { data, error } = useSWR(url, fetcher);
    const [isLoading, setIsLoading] = useState(false);
    const [apparel, setApparel] = useState(false);
    const { push } = useRouter();

    useEffect(() => {
        console.log('products data', data)
        setIsLoading(true)
        setApparel(data)
        setIsLoading(false)
      }, [data])

    const viewApparel = (product) => {
        console.log('product', product)
        const colorHex = product.colors[product.colors.length - 1].colorCode.replace( /#/g, "" )
        push(`/products/${product.syncProductId}/color/${colorHex}/size/${product.sizes[product.sizes.length - 1]}`)
    }
    
    if(isLoading) {
        return (
            <Backdrop
                open={isLoading}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Grid container direction="row">
            <Grid item xs={12} textAlign="center" >
                <Typography variant="h3" gutterBottom>NonFungible Apparel </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="h4" gutterBottom>Shirts</Typography>
            </Grid>
            <Grid item xs={8}>
                <Grid container justifyContent="flex-end">
                <Button>View All</Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        apparel && 
                        apparel.TSHIRTS &&
                        apparel.TSHIRTS.map((tshirt) => (
                            <Grid item xs={3} key={tshirt._id}>
                                <Card 
                                    key={tshirt._id}
                                    onClick={() => viewApparel(tshirt)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={tshirt.imagePreviewUrl}
                                        alt={tshirt.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {tshirt.name}
                                        </Typography>
                                        <Typography gutterBottom variant="h6" component="div">
                                            Project: { tshirt.tokenData.tokenName}
                                        </Typography>
                                        <br />
                                        <Grid item xs={12}>
                                            Colors: {tshirt.colors.map((color) => (
                                                <Tooltip title={color.color}>
                                                    <ToggleButton key={color.colorCode} value={color.colorCode} style={{ backgroundColor: `${color.colorCode}`, margin: '2px', padding: '15px'}}></ToggleButton>
                                                </Tooltip>
                                            ))}
                                        </Grid>
                                        <br />
                                        <Grid item xs={12}>
                                            Sizes: {tshirt.sizes.map((size) => (
                                                <ToggleButton key={size} value={size} style={{margin: '2px'}}>{size}</ToggleButton>
                                            ))}
                                        </Grid>
                                        <br />
                                        <Typography gutterBottom variant="h6" component="div">
                                            Price: ${ tshirt.maxPrice } - ${ tshirt.minPrice }
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )) 


                    }

                </Grid>
            </Grid>
        </Grid>
    )
}

