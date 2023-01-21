import { useState } from 'react';
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
    Tooltip,
    ToggleButton
  } from '@mui/material'


  export default function Projects(props) {
    return (
        <Grid container direction='row'>
            <Grid item xs={12}>

            </Grid>
        </Grid>
    )

  }


  export async function getServerSideProps(context) {
    try {
        const res = await fetch('http://localhost:3000/api/projects/filters')
        const data = await res.json()
        const { projects, filters } = data
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