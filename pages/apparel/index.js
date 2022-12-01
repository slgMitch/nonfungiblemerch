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
  ToggleButton
} from '@mui/material';
import useSWR from 'swr';
import { useRouter } from 'next/router';

export default function Apparel() {

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const url = `/api/products/get-all-products`;
    const { data, error } = useSWR(url, fetcher);
    const [isLoading, setIsLoading] = useState(false);
    const [apparel, setApparel] = useState(false);
    const { push } = useRouter();

    useEffect(() => {
        setIsLoading(true)
        setApparel(data)
        setIsLoading(false)
      }, [data])

    const viewApparel = (apparelId) => {
        console.log('apparelId', apparelId)
        push(`/apparel/${apparelId}`)
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
                                    sx={{ cursor: 'pointer' }}
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
                                        <br />
                                        <Grid item xs={12}>
                                            Colors: {tshirt.colors.map((color) => (
                                                <ToggleButton key={color} value={color} style={{ backgroundColor: `${color}`, margin: '2px', padding: '15px'}}></ToggleButton>
                                            ))}
                                        </Grid>
                                        <br />
                                        <Grid item xs={12}>
                                            Sizes: {tshirt.sizes.map((size) => (
                                                <ToggleButton key={size} value={size} style={{margin: '2px'}}>{size}</ToggleButton>
                                            ))}
                                        </Grid>
                                        <br />
                                        <Typography gutterBottom variant="h6" component="div">
                                            Price: ${ tshirt.maxPrice.toFixed(2) } - ${ tshirt.minPrice.toFixed(2) }
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

