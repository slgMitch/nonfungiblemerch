import { 
    Typography, 
    Button, 
    Grid, 
    FormControl,
    MenuItem,
    InputLabel,
    Select,
  } from '@mui/material';

export default function ProductDisplay(props) {
    console.log('props', props)
    return (
        <Grid 
            container 
            direction="row"
        >
            <Grid item xs={6} align="center">
                 <Image 
                    src={selectedVatiant.image}
                    alt={product._id}
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
                                    onChange={changeSelectedColor}
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
                                        onChange={changeSelectedSize}
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
                                // onClick={() => addToCart(selectedVatiant)}
                                className="snipcart-add-item"
                                data-item-id={product._id}
                                data-item-price={selectedVatiant.price}
                                data-item-url={`/apparel/${product._id}`}
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