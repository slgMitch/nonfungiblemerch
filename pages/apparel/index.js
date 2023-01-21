import { useState, useEffect } from 'react';
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
    Slider,
    Tooltip,
    ToggleButton
  } from '@mui/material'
import useSWR from 'swr';
import { useRouter } from 'next/router';

export default function Apparel(props) {
    const { filters, products } = props
    console.log('filters', filters)
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [selectedFilters, setSelectedFilters] = useState([])

    const filterAccessories = (event, filterName, filter) => {
        if(event.target.checked) {
            // console.log('filterAccessories event', event)
            // console.log('filterAccessories filterName', filterName)
            // console.log('filterAccessories filter', filter)
            // console.log('products', products)
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
                case 'category':
                    setSelectedFilters([
                        ...selectedFilters,
                        { filterName, filter }
                    ])
                    setFilteredProducts([
                        ...filteredProducts.filter(product => product.productCategory === filter)
                    ])
                    break;
            }
        } else if(!event.target.checked) {
            console.log('need to add shit back')
            switch (filterName) {
                case 'collection':
                    setSelectedFilters([
                        ...selectedFilters.filter(filter => filter.filterName === filterName && filter.filter === filter)
                    ])
                    setFilteredProducts([
                        ...products.filter(product => product.collection !== filter)
                    ])
                    
                    break;
                case 'category':
                    setSelectedFilters([
                        ...selectedFilters.filter(filter => filter.filterName === filterName && filter.filter === filter)
                    ])
                    setFilteredProducts([
                        ...filteredProducts,
                        ...products.filter(product => product.productCategory !== filter)
                    ])
                    
                    break;
            
            }
        }
    }



    // const viewApparel = (product) => {
    //     console.log('product', product)
    //     const colorHex = product.colors[product.colors.length - 1].colorCode.replace( /#/g, "" )
    //     push(`/products/${product.syncProductId}/color/${colorHex}/size/${product.sizes[product.sizes.length - 1]}`)
    // }
    


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
                    <Typography variant='h6'>
                        Category
                    </Typography>
                    <ListItem>
                        <FormGroup>
                            {
                                filters.categories.map((category) => (
                                    <FormControlLabel
                                        key={category}  
                                        control={
                                            <Checkbox 
                                                key={category}  
                                                disabled={selectedFilters.some(filter => filter.filter !== category && filter.filterName === 'category')}
                                                onChange={(event) => filterAccessories(event, 'category', category)}
                                            />
                                        }
                                        label={category}
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
                        <Typography textAlign='center' variant='h3'>Apparel</Typography>
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
        const res = await fetch('http://localhost:3000/api/apparel/filters')
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

