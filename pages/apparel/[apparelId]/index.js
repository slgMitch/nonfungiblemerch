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
import ProductDisplay from '../../../src/components/ProductDisplay/ProductDisplay';

export default function ApparelId(props) {
    const { push, pathname } = useRouter();
    const { selectedVatiant, colorOptions, sizeOptions, availabilityStatus } = props;
    const [isLoading, setIsLoading] = useState(false);
    // const [selectedVatiant, setSelectedVariant] = useState();
    // const [colorOptions, setColorOptions] = useState();
    // const [sizeOptions, setSizeOptions] = useState();
    // const [availabilityStatus, setAvailabilityStatus] = useState();

    // useEffect(() => {
        // setIsLoading(true)
        // setSelectedVariant(product ? product.variants[product.variants.length - 1] : null)
        // setColorOptions(product ? [...new Set(product.variants.map(variant => variant.color))] : null)
        // setSizeOptions(product ? [...new Set(product.variants.map(variant => variant.size))] : null)
        // setAvailabilityStatus(product ? product.variants[product.variants.length - 1].availability_status.find((status) => status.region === 'US') : null)
        // console.log('product', product)
        // setIsLoading(false)
    // }, [product])


    // const changeSelectedColor = (event) => {
    //     const variant = product.variants.find((variant) => variant.color === event.target.value && variant.size === selectedVatiant.size)
    //     console.log('variant', variant)
    //     setSelectedVariant(variant)
    //     setAvailabilityStatus(variant.availability_status.find((status) => status.region === 'US'))
    // }

    // const changeSelectedSize = (event) => {
    //     const variant = product.variants.find((variant) => variant.size === event.target.value && variant.color === selectedVatiant.color)
    //     console.log('variant', variant)
    //     setSelectedVariant(variant)
    //     setAvailabilityStatus(variant.availability_status.find((status) => status.region === 'US'))
    // }


    if(!selectedVatiant || isLoading) {
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
                    src={selectedVatiant.image}
                    alt={selectedVatiant.id}
                    width={500}
                    height={500}

                 />
            </Grid>
            <Grid item xs={6}> 
                <Typography align="center" variant="h4" gutterBottom>{selectedVatiant.name}</Typography>
                <br/>
                <Typography variant="h5"> Price: ${selectedVatiant.price} </Typography>
                <br/>
                <Grid item xs={12}>
                    <Grid container direction="row">
                        <Grid item xs={6}>
                            <FormControl sx={{ m: 1, minWidth: 420 }}>
                                <InputLabel id="product-color-select-label">Color</InputLabel>
                                <Select
                                    labelId="product-color-select-label"
                                    id="product-color-select"
                                    value={selectedVatiant.color}
                                    label="Color"
                                    // onChange={changeSelectedColor}
                                >
                                    {
                                        colorOptions &&
                                        colorOptions.map((color) => (
                                            <MenuItem key={color} value={color}>{color}</MenuItem>
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
                                        value={selectedVatiant.size}
                                        label="Size"
                                        // onChange={changeSelectedSize}
                                    >
                                        {
                                            sizeOptions &&
                                            sizeOptions.map((size) => (
                                                <MenuItem key={size} value={size}>{size}</MenuItem>
                                            ))
                                        }

                                    </Select>
                                </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <br />
                            <Typography variant="h5">Status: {availabilityStatus.status === 'in_stock' ? 'In Stock' : 'Out of Stock'} </Typography>
                        </Grid>
                        <Grid item align="center" xs={12}>
                            <br />
                            <Button 
                                variant="contained" 
                                size="large" 
                                sx={{
                                    minWidth: 800
                                }}
                                disabled={availabilityStatus.status === 'in_stock' ? false : true}
                                className="snipcart-add-item"
                                data-item-id={selectedVatiant.id}
                                data-item-price={selectedVatiant.price}
                                data-item-url={`/apparel/${selectedVatiant._id}`}
                                data-item-name={selectedVatiant.name}
                                data-item-image={selectedVatiant.image}
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
    const {apparelId} = context.params
    const res = await fetch(`http://localhost:3000/api/products/${apparelId}`)
    const data = await res.json()
    // console.log('getServerSideProps', data)
    return {
        props: {
            selectedVatiant: data.selectedVatiant,
            colorOptions: data.colorOptions,
            sizeOptions: data.sizeOptions,
            availabilityStatus: data.availabilityStatus
        }
    }
  }