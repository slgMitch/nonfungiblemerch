import { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Grid, 
  Backdrop,
  CircularProgress,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';


export default function CustomProducts(props) {
    const { products } = props
    return (
        <Grid
            container
            direction='row'
        >
            <Typography>Custom Product by Sync Product Id</Typography>

        </Grid>
    )
}

export async function getServerSideProps(context) {
    const { syncProductId } = context.params
    const response = await fetch(`${process.env.API_BASE_DOMAIN}/api/product/${syncProductId}`)
    const data = await response.json()
    console.log('getServerSideProps data', data);
    return {
        props: {
            products: data
        }
    }
}