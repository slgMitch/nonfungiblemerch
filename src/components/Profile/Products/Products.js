import { useState, useEffect, Fragment } from 'react'
import { 
    Grid,
    Typography,
    Backdrop,
    Box,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    ToggleButton,
    Tooltip,
    Button,
    Modal,
    Stepper,
    Step,
    StepLabel
  } from '@mui/material'
import useSWR from 'swr'
import axios from 'axios'
import BaseProducts from './Steps/BaseProducts'
import Images from './Steps/Images'
import ImagePlacement from './Steps/ImagePlacement'
import Review from './Steps/Review'


const createProductSteps = ['Select a Product', 'Select an image', 'Select image placement']

export default function Products(props) {
    const { user } = props
    const fetcher = (url) => fetch(url).then((res) => res.json())
    const url = `/api/profile/products/${user}`
    const { data, error } = useSWR(url, fetcher)
    const [products, setProducts] = useState()
    const [baseProducts, setBaseProducts] = useState()
    const [userImages, setUserImages] = useState()
    const [imagePlacements, setImagePlacements] = useState()
    const [selectedBaseProduct, setSelectedBaseProduct] = useState()
    const [selectedUserImage, setSelectedUserImage] = useState()
    const [selectedImagePlacement, setSelectedImagePlacement] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [showCreateProductModal, setShowCreateProductModal] = useState(false)
    const [activeStep, setActiveStep] = useState(0)
    const [canGoToNextStep, setCanGoToNextStep] = useState(false)
    

    useEffect(() => {
        setIsLoading(true)
        setProducts(data)
        setIsLoading(false)
    }, [data])

    if(!data || !products || isLoading) {
        return (
            <Backdrop
                open={!products || isLoading}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    const openCreateProductModal = async () => {
        setIsLoading(true)
        const products = await getBaseProducts()
        setBaseProducts(products)
        const images = await getUserImages()
        setUserImages(images)
        setIsLoading(false)
        setShowCreateProductModal(true)
    }

    const getBaseProducts = async () => {
        const { data } = await axios.get('/api/base-products/get-all', {
            headers: {
                'content-type': 'application/json',
            },
        })
        return data
    }

    const getUserImages = async () => {
        const { data } = await axios.get(`/api/profile/nfts/${user}`, {
            headers: {
                'content-type': 'application/json',
            },
        })
        return data
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const createProduct = async () => {
        setIsLoading(true)
        const craeteProductRequest = {
            selectedBaseProduct,
            selectedUserImage,
            selectedImagePlacement
        }

        const { data } = await axios.post(`${process.env.CREATE_PRODUCT_EVENT_URL}`, {
            headers: {
                'content-type': 'application/json',
            },
        })
        console.log('craete product response data', data)
        setIsLoading(false)
    }

    const renderStep = (activeStep) => {
        switch(activeStep) {
            case 0:
                return <BaseProducts 
                            baseProducts={baseProducts}
                            setSelectedBaseProduct={setSelectedBaseProduct}
                            setImagePlacements={setImagePlacements} 
                            selectedBaseProduct={selectedBaseProduct}
                            setCanGoToNextStep={setCanGoToNextStep}
                        />
            case 1:
                return <Images 
                            userImages={userImages}
                            setSelectedUserImage={setSelectedUserImage}
                            selectedUserImage={selectedUserImage}
                            setCanGoToNextStep={setCanGoToNextStep} 
                        />
            case 2:
                return <ImagePlacement 
                            imagePlacements={imagePlacements}
                            setSelectedImagePlacement={setSelectedImagePlacement} 
                            selectedImagePlacement={selectedImagePlacement}
                            setCanGoToNextStep={setCanGoToNextStep}
                        />
        }
    }

    const cancelProductCreation = () => {
        setSelectedBaseProduct()
        setSelectedUserImage()
        setSelectedImagePlacement()
        setActiveStep(0)
        setShowCreateProductModal(false)
        setCanGoToNextStep(false)
    }



    return (
        <Grid container direction="row" >
            <Grid item xs={12}>
                <Typography variant="h3" textAlign='center'>My Products</Typography>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
                <Button onClick={() => openCreateProductModal()}>Add Product</Button>
            </Grid>
            <Grid item xs={12}>
                {
                    products && products.length ? (
                        <Grid
                            container
                            spacing={3}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            {
                                products.map((product) => (
                                    <Grid item xs={3} key={product._id}>
                                        <Card
                                            key={product._id}
                                            sx={{
                                                height: '800px'
                                            }}
                                        >
                                            <CardMedia 
                                                component='img'
                                                image={product.imagePreviewUrl}
                                                alt={product.name}
                                            />
                                            <CardContent>
                                                <Typography noWrap gutterBottom component="div">
                                                    {product.name}
                                                </Typography>
                                                <Typography noWrap gutterBottom component="div">
                                                    Project: { product.tokenData.tokenName}
                                                </Typography>
                                                <br />
                                                <Grid item xs={12}>
                                                    Colors: {product.colors.map((color) => (
                                                        <Tooltip key={color.colorCode} title={color.color}>
                                                            <ToggleButton key={color.colorCode} value={color.colorCode} style={{ backgroundColor: `${color.colorCode}`, margin: '2px', padding: '15px'}}></ToggleButton>
                                                        </Tooltip>
                                                    ))}
                                                </Grid>
                                                <br />
                                                <Grid item xs={12}>
                                                    Sizes: {product.sizes.map((size) => (
                                                        <ToggleButton key={size} value={size} style={{margin: '2px'}}>{size}</ToggleButton>
                                                    ))}
                                                </Grid>
                                                <br />
                                                <Typography noWrap gutterBottom component="div">
                                                    Price: ${ product.minPrice } - ${ product.maxPrice }
                                                </Typography>
                                            </CardContent>

                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    ) : (
                        <Grid 
                            container
                            direction='row'
                            justifyContent="center" 
                            alignContent="center"
                            style={{ minHeight: "100vh" }}
                        >
                            <Grid item xs={6}>
                                <Card sx={{ borderRadius: '16px', top: '50%' }}>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom textAlign="center">
                                            You don't have any Products... Start the process by clicking below!
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => openCreateProductModal()}>Create Products</Button>
                                    </CardActions>
                                </Card>
                            </Grid>

                        </Grid>
                    )
                }
                <Modal open={showCreateProductModal} sx={{ overflow: 'scroll'}}>
                    <Box sx={{ width: '100%', backgroundColor: 'white' }}>
                            <Stepper sx={{ paddingTop: '20px', paddingBottom: '50px' }} activeStep={activeStep}>
                                {
                                    createProductSteps.map((label, index) => {
                                        const stepProps = {};
                                        const labelProps = {};
                                        return (
                                            <Step key={label} {...stepProps}>
                                                <StepLabel {...labelProps}>{label}</StepLabel>
                                            </Step>
                                        )
                                    })
                                }
                            </Stepper>
                            {
                                activeStep === createProductSteps.length ? (
                                    <Fragment>
                                        <Review 
                                            selectedBaseProduct={selectedBaseProduct}
                                            selectedUserImage={selectedUserImage}
                                            selectedImagePlacement={selectedImagePlacement}
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                            <Button
                                                color="inherit"
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                sx={{ mr: 1 }}
                                            >
                                                Back
                                            </Button>
                                            <Button onClick={() => cancelProductCreation()}>Cancel</Button>
                                            <Box sx={{ flex: '1 1 auto' }} />
                                            <Button onClick={() => createProduct()}>Create</Button>
                                        </Box>
                                  </Fragment>
                                ) : (
                                    <Grid container direction='row'>
                                        {renderStep(activeStep)}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                            <Button
                                                color="inherit"
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                sx={{ mr: 1 }}
                                            >
                                                Back
                                            </Button>
                                            <Button onClick={() => cancelProductCreation()}>Cancel</Button>
                                            <Box sx={{ flex: '1 1 auto' }} />
                                            <Button onClick={handleNext} disabled={!canGoToNextStep}>Next</Button>
                                        </Box>
                                    </Grid>
                                )
                            }
                    </Box>

                </Modal>

            </Grid>
        </Grid>
    )
}