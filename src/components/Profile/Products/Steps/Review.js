import { 
    Grid,
    Typography,
  } from '@mui/material'

export default function Review(props) {
    const {
        selectedBaseProduct,
        selectedUserImages,
        selectedImagePlacement
    } = props

    console.log('selectedBaseProduct', selectedBaseProduct)
    console.log('selectedUserImages', selectedUserImages)
    console.log('selectedImagePlacement', selectedImagePlacement)

    return (
        <Grid container direction="row">
            <Grid item xs={12}>
                <Typography variant="h3">Review</Typography>
            </Grid>
        </Grid>
    )
}