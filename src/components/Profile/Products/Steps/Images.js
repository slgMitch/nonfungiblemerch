import { 
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
  } from '@mui/material'

export default function Images(props) {
    const {
        userImages,
        setSelectedUserImage,
        selectedUserImage,
        setCanGoToNextStep
    } = props

    if(!selectedUserImage) {
        setCanGoToNextStep(false)
    }

    const selectImage = (image) => {
        setSelectedUserImage(image)
        setCanGoToNextStep(true)
    }


    return (
        <Grid container direction="row">
            <Grid item xs={12}>
                <Typography variant="h3">Images</Typography>
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
                        userImages &&
                        userImages.map((image) => (
                            <Grid item xs={3} key={image._id}>
                                <Card
                                    key={image._id}
                                    sx={{
                                        ":hover": { 
                                            boxShadow: '-1px 10px 29px 0px rgba(0,0,0,0.8);', 
                                            cursor: 'pointer' 
                                        },
                                        boxShadow: selectedUserImage && selectedUserImage._id === image._id ? '-1px 10px 29px 0px rgba(0,0,0,0.8);' : ''
                                    }}
                                    onClick={() => selectImage(image)}
                                >
                                    <CardMedia 
                                        component='img'
                                        image={image.metadata.image}
                                        alt={image.metadata.name}
                                    />
                                    <CardContent>
                                        <Typography noWrap gutterBottom component="div">
                                            {image.metadata.name}
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