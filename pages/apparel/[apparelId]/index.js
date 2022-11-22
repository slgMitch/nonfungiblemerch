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

export default function ApparelId(props) {
    const { apparelId } = props;
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const url = `/api/products/${apparelId}`;
    const { data, error } = useSWR(url, fetcher);
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        setProduct(data)
        console.log('data', data)
        setIsLoading(false)
    }, [data])
    return (
        <Grid container direction="row">
            <Grid item xs={12} textAlign="center">
                <Typography></Typography>
            </Grid>
        </Grid>
    )

}

export async function getServerSideProps(context) {
    const {apparelId} = context.params
    return {
        props: {
            apparelId
        }
    }
  }