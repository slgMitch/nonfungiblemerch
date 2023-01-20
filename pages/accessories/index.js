import { useState } from 'react'
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

export default function Accessories(props) {
    const { filters, products } = props
    const [filteredProducts, setFilteredProducts] = useState(products)

    const filterAccessories = (event, filterName, filter) => {
        if(event.target.checked) {
            // console.log('filterAccessories event', event)
            // console.log('filterAccessories filterName', filterName)
            // console.log('filterAccessories filter', filter)
            console.log('products', products)
            switch (filterName) {
                case 'name':
                    console.log('filterAccessories filter name', filter)
                    setFilteredProducts([
                        ...filteredProducts.filter(product => product.tokenData.tokenName === filter)
                    ])
                    
                    break;
                case 'collection':
                    console.log('filterAccessories filter collections', filter)
                    setFilteredProducts([
                        ...filteredProducts.filter(product => product.tokenData.tokenCollection === filter)
                    ])
                    
                    break;
                case 'color':
                    console.log('filterAccessories filter color', filter)
                    setFilteredProducts([
                        ...filteredProducts.filter(product => product.colors.some(color => color.color === filter.color))
                    ])
                    
                    break;
                case 'category':
                    console.log('filterAccessories filter category', filter)
                    setFilteredProducts([
                        ...filteredProducts.filter(product => product.category === filter)
                    ])
                    
                    break;
            }
        } else if(event.target.checked) {
            console.log('need to add shit back')
        }
    }

    const filterPrice = (event) => {
        console.log('filterAccessories event', event.target.value)

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
                        Token Name
                    </Typography>
                    <ListItem>
                        <FormGroup>
                            {
                                filters.tokenNames.map((tokenName) => (
                                    <FormControlLabel
                                        key={tokenName} 
                                        control={
                                            <Checkbox 
                                                key={tokenName}
                                                onChange={(event) => filterAccessories(event, 'name', tokenName)}
                                            />
                                        }
                                        label={tokenName}
                                    />

                                ))
                            }
                        </FormGroup>
                    </ListItem>
                    <Divider />
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
                        Colors
                    </Typography>
                    <ListItem>
                        <FormGroup>
                            {
                                filters.colors.map((color) => (
                                    <FormControlLabel
                                        key={color.color} 
                                        control={
                                            <Checkbox 
                                                key={color.color} 
                                                onChange={(event) => filterAccessories(event, 'color', color)}
                                            />
                                        }
                                        label={color.color}
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
                    <Typography variant='h6'>
                        Price
                    </Typography>
                    <ListItem>
                        <Slider 
                            marks={
                                [
                                    { 
                                        value: filters.prices.minPrice, 
                                        label: filters.prices.minPrice 
                                    }, 
                                    { 
                                        value: filters.prices.maxPrice, 
                                        label: filters.prices.maxPrice 
                                    }
                                ]
                            }
                            min={filters.prices.minPrice}
                            max={filters.prices.maxPrice}
                            step={1}
                            onChange={(event) => filterPrice(event)}
                        />

                    </ListItem>
                    <Divider />

                </List>

            </Grid>
            <Grid item xs={10}>
                <Grid container direction='row'>
                    <Grid item xs={12}>
                        <Typography textAlign='center' variant='h3'>Accessories</Typography>
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
                                                // cursor: 'pointer' 
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
                                                <Typography gutterBottom variant="h6" component="div">
                                                    Price: ${ product.maxPrice } - ${ product.minPrice }
                                                </Typography>
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
        const res = await fetch('http://localhost:3000/api/accessories/filters')
        const data = await res.json()
        const { accessories, filters } = data
        return {
            props: {
                filters,
                products: accessories
            }
        }
    } catch(error) {
        console.log('getServerSideProps error', error)
    }
}