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
  CardActionArea
} from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';


export default function All() {
    const [products, setProducts] = useState();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fetcher = (url) => fetch(url).then((res) => res.json())
    const url = '/api/base-products/get-all'
    const { data, error } = useSWR(url, fetcher)
    const { push } = useRouter();

    useEffect(() => {
        console.log('products', data)
        setIsLoading(true)
        setProducts(data)
        setIsLoading(false)

    }, [data]) 

    const addToSelectedProducts = (selectedProduct) => {
        setSelectedProducts(selectedProducts => [...selectedProducts, selectedProduct])
        console.log('selectedProducts', selectedProducts)
    }
    
    if(error) {
        return <p>Failed to load... {error}</p>
    }

    if(!data || !products) {
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
            <Grid item xs={12} textAlign="center">
                <Typography variant="h3">Select Products</Typography>
            </Grid>
            <Grid container direction="row">
                <Grid item xs={12} textAlign="left">
                    <Typography variant="h5">Shirts</Typography>
                </Grid>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        products &&
                        products.TSHIRTS &&
                        products.TSHIRTS.map((tshirt) => (
                            <Grid item xs={3} key={tshirt.id}> 
                                <Card  
                                    key={tshirt.id}
                                    onClick={() => addToSelectedProducts(tshirt)}
                                >
                                    <CardActionArea>
                                        <CardMedia 
                                            component="img"
                                            image={tshirt.image}
                                            alt={tshirt.title}
                                            height="300px"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {tshirt.title}
                                            </Typography>  
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                        ))
                    }
                </Grid>
            </Grid>
            <br />
            <Grid container direction="row">
                <Grid item xs={12} textAlign="left">
                    <Typography variant="h5">Hoodies</Typography>
                </Grid>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        products &&
                        products.HOODIES &&
                        products.HOODIES.map((hoodie) => (
                            <Grid item xs={3} key={hoodie.id}> 
                                <Card  
                                    key={hoodie.id}
                                    onClick={() => addToSelectedProducts(hoodie)}
                                >
                                    <CardActionArea>
                                        <CardMedia 
                                            component="img"
                                            image={hoodie.image}
                                            alt={hoodie.title}
                                            height="300px"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {hoodie.title}
                                            </Typography>  
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                        ))
                    }
                </Grid>
            </Grid>
            <br />
            <Grid container direction="row">
                <Grid item xs={12} textAlign="left">
                    <Typography variant="h5">Sweatshirts</Typography>
                </Grid>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        products &&
                        products.SWEATSHIRTS &&
                        products.SWEATSHIRTS.map((sweatshirt) => (
                            <Grid item xs={3} key={sweatshirt.id}> 
                                <Card  
                                    key={sweatshirt.id}
                                    onClick={() => addToSelectedProducts(sweatshirt)}
                                >
                                    <CardActionArea>
                                        <CardMedia 
                                            component="img"
                                            image={sweatshirt.image}
                                            alt={sweatshirt.title}
                                            height="300px"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {sweatshirt.title}
                                            </Typography>  
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                        ))
                    }
                </Grid>
            </Grid>
            <br />
            <Grid container direction="row">
                <Grid item xs={12} textAlign="left">
                    <Typography variant="h5">Pants</Typography>
                </Grid>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        products &&
                        products.PANTS &&
                        products.PANTS.map((pant) => (
                            <Grid item xs={3} key={pant.id}> 
                                <Card  
                                    key={pant.id}
                                    onClick={() => addToSelectedProducts(pant)}
                                >
                                    <CardActionArea>
                                        <CardMedia 
                                            component="img"
                                            image={pant.image}
                                            alt={pant.title}
                                            height="300px"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {pant.title}
                                            </Typography>  
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                        ))
                    }
                </Grid>
            </Grid>
            <br />
            <Grid container direction="row">
                <Grid item xs={12} textAlign="left">
                    <Typography variant="h5">Shorts</Typography>
                </Grid>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        products &&
                        products.SHORTS &&
                        products.SHORTS.map((short) => (
                            <Grid item xs={3} key={short.id}> 
                                <Card  
                                    key={short.id}
                                    onClick={() => addToSelectedProducts(short)}
                                >
                                    <CardActionArea>
                                        <CardMedia 
                                            component="img"
                                            image={short.image}
                                            alt={short.title}
                                            height="300px"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {short.title}
                                            </Typography>  
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                        ))
                    }
                </Grid>
            </Grid>
            <br />
            <Grid container direction="row">
                <Grid item xs={12} textAlign="left">
                    <Typography variant="h5">Bags</Typography>
                </Grid>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        products &&
                        products.BAGS &&
                        products.BAGS.map((bag) => (
                            <Grid item xs={3} key={bag.id}> 
                                <Card  
                                    key={bag.id}
                                    onClick={() => addToSelectedProducts(bag)}
                                >
                                    <CardActionArea>
                                        <CardMedia 
                                            component="img"
                                            image={bag.image}
                                            alt={bag.title}
                                            height="300px"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {bag.title}
                                            </Typography>  
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                        ))
                    }
                </Grid>
            </Grid>
            <br />
            <Grid container direction="row">
                <Grid item xs={12} textAlign="left">
                    <Typography variant="h5">Cases</Typography>
                </Grid>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        products &&
                        products.CASES &&
                        products.CASES.map((c) => (
                            <Grid item xs={3} key={c.id}> 
                                <Card  
                                    key={c.id}
                                    onClick={() => addToSelectedProducts(c)}
                                >
                                    <CardActionArea>
                                        <CardMedia 
                                            component="img"
                                            image={c.image}
                                            alt={c.title}
                                            height="300px"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {c.title}
                                            </Typography>  
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                        ))
                    }
                </Grid>
            </Grid>
            <br />
            <Grid container direction="row">
                <Grid item xs={12} textAlign="left">
                    <Typography variant="h5">Pillows</Typography>
                </Grid>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        products &&
                        products.PILLOWS &&
                        products.PILLOWS.map((pillow) => (
                            <Grid item xs={3} key={pillow.id}> 
                                <Card  
                                    key={pillow.id}
                                    onClick={() => addToSelectedProducts(pillow)}
                                >
                                    <CardActionArea>
                                        <CardMedia 
                                            component="img"
                                            image={pillow.image}
                                            alt={pillow.title}
                                            height="300px"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {pillow.title}
                                            </Typography>  
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                        ))
                    }
                </Grid>
            </Grid>
            <br />
            <Grid container direction="row">
                <Grid item xs={12} textAlign="left">
                    <Typography variant="h5">Prints</Typography>
                </Grid>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    {
                        products &&
                        products.PRINTS &&
                        products.PRINTS.map((print) => (
                            <Grid item xs={3} key={print.id}> 
                                <Card  
                                    key={print.id}
                                    onClick={() => addToSelectedProducts(print)}
                                >
                                    <CardActionArea>
                                        <CardMedia 
                                            component="img"
                                            image={print.image}
                                            alt={print.title}
                                            height="300px"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {print.title}
                                            </Typography>  
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                        ))
                    }
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item xs={12} textAlign="center">
                    <Typography variant="h3">Select NFT</Typography>
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-end">
                <Grid item xs={12} >
                    <Button>Add Merch</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}