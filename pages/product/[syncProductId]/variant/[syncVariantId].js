import { useState } from "react";
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
    const { products, variant, productColors, productSizes } = props
    const [selectedSize, setSelectedSize] = useState(variant.size)
    const [selectedColor, setSelectedColor] = useState(variant.color.color)
    const { push } = useRouter()

    const changeProductColor = (color) => {
      setSelectedColor(color)
      const selectedProduct = products.find(product => product.color.color === color && product.size === selectedSize)
      push(`/product/${selectedProduct.syncProductId}/variant/${selectedProduct.syncVariantId}`)

    }

    const changeProductSize = (size) => {
      setSelectedSize(size)
      const selectedProduct = products.find(product => product.color.color === selectedColor && product.size === size)
      push(`/product/${selectedProduct.syncProductId}/variant/${selectedProduct.syncVariantId}`)
    }

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
                    value={selectedColor}
                    label="Color"
                    onChange={(event) => changeProductColor(event.target.value)} 
                  >
                    {
                        productColors &&
                        productColors.map((color) => (
                            <MenuItem key={color.color} value={color.color}>{color.color}</MenuItem>
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
                      value={selectedSize}
                      label="Size"
                      onChange={(event) => changeProductSize(event.target.value)}
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
  const response = await fetch(`${process.env.API_BASE_DOMAIN}/api/product/${syncProductId}/variant/${syncVariantId}`);
  const { products, variant, productColors, productSizes } = await response.json()
  // console.log('getServerSideProps data', { products, variant });
  return {
    props: {
        products,
        variant: variant[0],
        productColors, 
        productSizes
    }
  }
}
