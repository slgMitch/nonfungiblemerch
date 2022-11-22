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
  CardActionArea,
  ToggleButton
} from '@mui/material';
import useSWR from 'swr';

export default function Apparel() {

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const url = `/api/products/get-all-products`;
    const { data, error } = useSWR(url, fetcher);
    const [isLoading, setIsLoading] = useState(false);
    const [apparel, setApparel] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        setApparel(data)
        setIsLoading(false)
      }, [data])
    
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
                                    onClick={() => viewApparel(tshirt._id)}
                                >
                                    <CardMedia
                                        component="img"
                                        image={tshirt.imageUrl}
                                        alt={tshirt.merchName}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {tshirt.merchName}
                                        </Typography>
                                        <Typography gutterBottom variant="h6" component="div">
                                            Project: { tshirt.tokenData.tokenName}
                                        </Typography>
                                        <Grid container xs={12} style={{ border: '1px solid black'}}>
                                            <Grid item xs={6} style={{ border: '1px solid red'}}>
                                                {tshirt.colors.map((color) => (
                                                    <ToggleButton style={{ backgroundColor: `${color}`}}></ToggleButton>
                                                ))}
                                            </Grid>
                                            <Grid item xs={6} style={{ border: '1px solid blue'}}>
                                                {tshirt.sizes.map((size) => (
                                                    <Typography variant="h6">{size}</Typography>
                                                ))}
                                            </Grid>
                                        </Grid>
                                        <Typography gutterBottom variant="h6" component="div">
                                            Price: { tshirt.maxPrice } - { tshirt.minPrice }
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

