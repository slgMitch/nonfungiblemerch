import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { 
    Box, 
    Grid, 
    Typography,
    Backdrop,  
    CircularProgress,
    Card,
    CardActionArea,
    CardMedia,
    CardContent
} from '@mui/material';
import useSWR from 'swr';


export default function TShirts() {
    const [tSirts, setTShirts] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const fetcher = (url) => fetch(url).then((res) => res.json())
    const url = '/api/base-products/t-shirts'
    const { data, error } = useSWR(url, fetcher)
    const { push } = useRouter();

    const showVariants = (shirtId) => {
        push(`/merch/add/t-shirts/${shirtId}`)
    }

    useEffect(() => {
        setIsLoading(true)
        setTShirts(data)
        setIsLoading(false)

    }, [data]) 
    
    if(error) {
        return <p>Failed to load... {error}</p>
    }

    if(!data || !tSirts) {
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
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} textAlign="center">
                    <Typography variant="h4">Add a new T-Shirt</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        {
                            tSirts.map((shirt) => (
                                <Grid item xs={3} key={shirt.id}>
                                    <Card onClick={() => showVariants(shirt.id)}>
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                image={shirt.image}
                                                alt={shirt.title}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {shirt.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {shirt.description}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>

                                </Grid>
                            ))
                        }

                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
