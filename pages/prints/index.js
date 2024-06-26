import { useState } from 'react';
import { 
    Card,
    CardContent,
    Grid,
    Typography,
    Divider,
    List,
    ListItem,
    CardMedia,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Tooltip,
    ToggleButton,
    Backdrop,
    CircularProgress
  } from '@mui/material'
  import { useRouter } from 'next/router'
  import axios from 'axios';

  export default function Prints(props) {
    const { filters, products } = props
    const { push } = useRouter()
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [selectedFilters, setSelectedFilters] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const filterAccessories = (event, filterName, filter) => {
        if(event.target.checked) {
            switch (filterName) {
                case 'collection':
                    setSelectedFilters([
                        ...selectedFilters,
                        { filterName, filter }
                    ])
                    setFilteredProducts([
                        ...filteredProducts.filter(product => product.tokenData.tokenCollection === filter)
                    ])
                    break;
            }
        } else if(!event.target.checked) {
            switch (filterName) {
                case 'collection':
                    setSelectedFilters([
                        ...selectedFilters.filter(filter => filter.filterName === filterName && filter.filter === filter)
                    ])
                    setFilteredProducts([
                        ...products.filter(product => product.collection !== filter)
                    ])
                    
                    break;
            
            }
        }
    }

    const viewProduct = async (product) => {
        console.log('product', product)
        setIsLoading(true);
        const { data } = await axios.get(`http://localhost:3000/api/product/${product.syncProductId}/getProductVariant`, {
            headers: {
                'content-type': 'application/json',
            },
        })
        console.log('data', data)
        push(`/product/${product.syncProductId}/variant/${data.syncVariantId}`)
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
        <Grid container direction='row'>
            <Grid item xs={2}>
                <Typography variant='h4' textAlign='center'>
                    Filters
                </Typography>
                <Divider />
                <List>
                    <Typography variant='h6'>
                        Token Collection
                    </Typography>
                    <ListItem>
                        <FormGroup>
                            {
                                filters.tokenCollections.map((tokenCollection) => (
                                    <FormControlLabel 
                                        key={tokenCollection}
                                        control={
                                            <Checkbox
                                                key={tokenCollection} 
                                                disabled={selectedFilters.some(filter => filter.filter !== tokenCollection && filter.filterName === 'collection')}
                                                onChange={(event) => filterAccessories(event, 'collection', tokenCollection)}
                                            />
                                        }
                                        label={tokenCollection}
                                    />

                                ))
                            }
                        </FormGroup>
                    </ListItem>
                    <Divider />
                </List>
            </Grid>
            <Grid item xs={10}>
                <Grid container direction='row'>
                    <Grid item xs={12}>
                        <Typography textAlign='center' variant='h3'>Prints</Typography>
                        <Grid
                            container
                            spacing={3}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            {
                                filteredProducts.map((product) => (
                                    <Grid item xs={3} key={product._id}>
                                        <Card
                                            key={product._id}
                                            onClick={() => viewProduct(product)}
                                            sx={{ 
                                                ":hover": { 
                                                    boxShadow: '-1px 10px 29px 0px rgba(0,0,0,0.8);', 
                                                    cursor: 'pointer' 
                                                },
                                            }}
                                        >
                                            <CardMedia 
                                                component="img"
                                                image={product.imagePreviewUrl}
                                                alt={product.name}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {product.name}
                                                </Typography>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    Project: { product.tokenData.tokenName}
                                                </Typography>
                                                <br />
                                                <Grid item xs={12}>
                                                    Colors: {product.colors.map((color) => (
                                                        <Tooltip title={color.color} key={color.colorCode}>
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
                                                {
                                                    product.minPrice === product.maxPrice ? (
                                                        <Typography gutterBottom variant="h6" component="div">
                                                            Price: ${ product.maxPrice }
                                                        </Typography>
                                                    ) : (
                                                        <Typography gutterBottom variant="h6" component="div">
                                                            Price: ${ product.minPrice } - ${ product.maxPrice }
                                                        </Typography>
                                                    )
                                                }
                                            </CardContent>

                                        </Card>
                                    </Grid>
                                ))
                            }

                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    )

  }

  export async function getServerSideProps(context) {
    try {
        const res = await fetch('http://localhost:3000/api/prints/filters')
        const data = await res.json()
        const { apparel, filters } = data
        return {
            props: {
                filters,
                products: apparel
            }
        }
    } catch(error) {
        console.log('getServerSideProps error', error)
    }
}