import { useState, useEffect } from "react";
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
} from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";

export default function CustomVariant(props) {
    const { products, variant } = props
    console.log('{ products, variant }', { products, variant });
    return (
        <Grid
        container
        direction='row'
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
                    value={variant.color.color}
                    label="Color"
                    // onChange={changeSelectedColor}
                  >
                    {
                        products &&
                        products.map((product) => (
                            <MenuItem key={product.color.color} value={product.color.color}>{product.color.color}</MenuItem>
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
                      // onChange={changeSelectedSize}
                  >
                      {
                          products &&
                          products.map((product) => (
                              <MenuItem key={product.size} value={product.size}>{product.size}</MenuItem>
                          ))
                      }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                  <br />
                  <Typography variant="h5">Status: {variant.availabilityStatus[0].status === 'in_stock' ? 'In Stock' : 'Out of Stock'}  </Typography>
              </Grid>
              <Grid item align="center" xs={12}>
                  <br />
                  <Button 
                      variant="contained" 
                      size="large" 
                      sx={{
                          minWidth: 800
                      }}
                      disabled={variant.availabilityStatus[0].status === 'in_stock' ? false : true}
                      className="snipcart-add-item"
                      data-item-id={variant.syncVariantId}
                      data-item-price={variant.retailPrice}
                      data-item-url={`/product/${variant.syncProductId}/variant/${variant.syncVariantId}`}
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
  const { syncProductId, syncVariantId } = context.params;
  // console.log("{ syncProductId, syncVariantId }", { syncProductId, syncVariantId });
  const response = await fetch(`http://localhost:3000/api/product/${syncProductId}/variant/${syncVariantId}`);
  const { products, variant } = await response.json()
  // console.log('getServerSideProps data', { products, variant });
  return {
    props: {
        products,
        variant: variant[0]
    }
  }
}
