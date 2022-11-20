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
        </Grid>
    )
}

