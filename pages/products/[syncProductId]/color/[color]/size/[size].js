import { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Grid, 
  Backdrop,
  CircularProgress,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Variant(props) {
    const { variant, productColors, productSizes, syncProductId } = props
    const { push, pathname } = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const changeSelectedColor = (event) => {
        const colorHex = event.target.value.replace( /#/g, "" )
        push(`/products/${syncProductId}/color/${colorHex}/size/${variant.size}`)
    }

    const changeSelectedSize = (event) => {
        const colorHex = variant.color.color_code.replace( /#/g, "" )
        push(`/products/${syncProductId}/color/${colorHex}/size/${event.target.value}`)
    }

    if(!variant || isLoading) {
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
        <Grid
            container 
            direction="row"
        >
            <Grid item xs={6} align="center">
                <Image 
                    src={variant.imagePreviewUrl}
                    alt={variant.syncVariantId}
                    width={500}
                    height={500}
                />
            </Grid>
            <Grid item xs={6}>
                <Typography align="center" variant="h4" gutterBottom>{variant.name}</Typography>
                <br/>
                <Typography variant="h5"> Price: ${variant.retailPrice} </Typography>
                <br/>
                <Grid item xs={12}>
                    <Grid container direction="row">
                        <Grid item xs={6}>
                            <FormControl sx={{ m: 1, minWidth: 420 }}>
                            <InputLabel id="product-color-select-label">Color</InputLabel>
                                <Select
                                    labelId="product-color-select-label"
                                    id="product-color-select"
                                    value={variant.color.color_code}
                                    label="Color"
                                    onChange={changeSelectedColor}
                                >
                                    {
                                        productColors &&
                                        productColors.map((color) => (
                                            <MenuItem key={color.color} value={color.colorCode}>{color.color}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{ m: 1, minWidth: 420 }}>
                                <InputLabel id="product-size-select-label">Size</InputLabel>
                                <Select
                                    labelId="product-size-select-label"
                                    id="product-size-select"
                                    value={variant.size}
                                    label="Size"
                                    onChange={changeSelectedSize}
                                >
                                    {
                                        productSizes &&
                                        productSizes.map((size) => (
                                            <MenuItem key={size} value={size}>{size}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <br />
                            <Typography variant="h5">Status:  </Typography>
                        </Grid>
                        <Grid item align="center" xs={12}>
                            <br />
                            <Button 
                                variant="contained" 
                                size="large" 
                                sx={{
                                    minWidth: 800
                                }}
                                // disabled={availabilityStatus.status === 'in_stock' ? false : true}
                                className="snipcart-add-item"
                                data-item-id={variant.syncVariantId}
                                data-item-price={variant.retailPrice}
                                data-item-url={`/products/${syncProductId}/color/${variant.color.color_code.replace( /#/g, "" )}/size/${variant.size}`}
                                data-item-name={variant.name}
                                data-item-image={variant.imagePreviewUrl}
                            >
                                Add to Cart
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export async function getServerSideProps(context) {
    const { syncProductId, color, size } = context.params
    const searchParams = new URLSearchParams({
        syncProductId,
        color,
        size
    })
    const res = await fetch('http://localhost:3000/api/variants/get-variants?' + searchParams)
    const data = await res.json()
    const { variant, productColors,  productSizes } = data
    console.log('getServerSideProps', data)

    return {
        props: {
            variant, 
            productColors,  
            productSizes,
            syncProductId
        }
    }
}

