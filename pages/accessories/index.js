import { useState } from 'react'
import { 
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemButton,
    ListItemText,
    Modal,
    CardMedia
  } from '@mui/material'

export default function Accessories(props) {
    const { filters, products } = props
    

    return (
        <Grid
            container 
            direction='row'
        >
            <Grid
                item 
                xs={2}
            >

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