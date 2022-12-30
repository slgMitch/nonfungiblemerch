import { 
    Grid,
    Typography,
  } from '@mui/material'

export default function Review(props) {
    const {
        selectedBaseProduct,
        selectedUserImage,
        selectedImagePlacement
    } = props

    console.log('selectedBaseProduct', selectedBaseProduct)
    console.log('selectedUserImage', selectedUserImage)
    console.log('selectedImagePlacement', selectedImagePlacement)

    return (
        <Grid container direction="row">
            <Grid item xs={12}>
                <Typography variant="h3">Review</Typography>
            </Grid>
        </Grid>
    )
}