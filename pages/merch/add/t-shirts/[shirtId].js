import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { 
    Box, 
    Grid, 
    Typography,
    Backdrop,  
    CircularProgress,
    Card,
    CardContent,
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    CardActionArea,
    CardMedia,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    Checkbox
} from '@mui/material';
import useSWR from 'swr';
import Image from 'next/image';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import axios from 'axios';


export default function Variants(props) {
    const [product, setProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [openWalletNFTs, setOpenWalletNFTs] = useState(false);
    const [walletNFTs, setWalletNFTs] = useState();
    const [selectedWalletNFT, setSelectedWalletNFT] = useState();
    const [removeImageBackgroundLoading, setRemoveImageBackgroundLoading] = useState(false)
    const [imageWithNoBackground, setImageWithNoBackground] = useState()
    const [imagePlacement, setImagePlacement] = useState();
    const [checked, setChecked] = useState(false);
    const { push, query } = useRouter();
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const url = `/api/base-products/${props.pid}`;
    const { data, error } = useSWR(url, fetcher);
    const { data: session } = useSession()
    
    useEffect(() => {
        setIsLoading(true)
        console.log('data', data)
        setProduct(data)
        setIsLoading(false)
    }, [data])


    const viewWalletNFTs = async () => {
        const { address } = session.user

        const requestData = { address }

        const { data } = await axios.post('/api/nft/wallet-nfts', requestData, {
            headers: {
                'content-type': 'application/json',
            },
        });
        setWalletNFTs(data)
        setOpenWalletNFTs(true)
    }


    const selectWalletNFT = (selectedNFT) => {
        const nft = walletNFTs.find((nft) => nft.token_id == selectedNFT)
        setSelectedWalletNFT(nft)
        setOpenWalletNFTs(false)
        console.log('nft', nft)
    }

    const handleImagePlacementChange = (event) => {
        setImagePlacement(event.target.value)
    }

    const createMerch = async () => {
        setIsLoading(true)
        const { address } = session.user
        const imagePlacementObject = product.file_placement_options.find(placement => placement.id === imagePlacement)

        const merchData = {
            userWalletAddress: address,
            merchName: imageWithNoBackground ? `${imagePlacementObject.title} No Background ${selectedWalletNFT.metadata.name} ${product.title}` : `${imagePlacementObject.title} ${selectedWalletNFT.metadata.name} ${product.title}`,
            imageUrl: imageWithNoBackground ? imageWithNoBackground : selectedWalletNFT.metadata.image,
            imagePlacement,
            product,
            nftData: selectedWalletNFT
        }

        const result = await axios.post('/api/printful/create-product', merchData, {
            headers: {
                'content-type': 'application/json'
            },
        });

        console.log('result', result)
        push(`/merch/${address}`)
        setIsLoading(false)
        
    }

    const handleRemoveImageBackgroundChange = async (event) => {
        setRemoveImageBackgroundLoading(true)
        setChecked(event.target.checked)
        console.log('selectedWalletNFT', selectedWalletNFT)
        const requestObject = {
            imageUrl: selectedWalletNFT.metadata.image,
            imageId: selectedWalletNFT.token_id
        }
        const result = await axios.post('/api/removebg/remove-image-background', requestObject, {
            headers: {
                'content-type': 'application/json'
            }
        });

        console.log('result', result);
        setImageWithNoBackground(result.data)
        setRemoveImageBackgroundLoading(false)
    }

    const generateNFTImageCard = () => {
        if(imageWithNoBackground) {
            return (
                <CardMedia 
                    component="img"
                    image={imageWithNoBackground}
                    alt={selectedWalletNFT.metadata.name}
                />
            )
        } else{ 
            return (
                <CardMedia 
                    component="img"
                    image={selectedWalletNFT.metadata.image}
                    alt={selectedWalletNFT.metadata.name}
                />
            )
        }
    }

    if(error) {
        return <p>Failed to load... {error}</p>
    }

    if(!data || !product || isLoading) {
        return (
            <Backdrop
                open={!product || isLoading}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Grid container direction="row">
            <Grid item xs={12} textAlign="center" >
                <Typography variant="h4" gutterBottom>Add a new T-Shirt</Typography>
            </Grid>
            <Grid item xs={6} style={{ border: '1px solid black' }}>
                 <Typography variant="h5" gutterBottom>{product.title}</Typography> 
                 <Image 
                    src={product.image}
                    alt={product.title}
                    width={500}
                    height={500}
                 />
            </Grid>
            <Grid item xs={6} style={{ border: '1px solid red' }}> 
                <Grid item xs={12}>
                    {
                        selectedWalletNFT ? (
                            <Card>
                                {
                                    removeImageBackgroundLoading ? (
                                        <CircularProgress color="inherit" />
                                    ) : (
                                             generateNFTImageCard() 
                                    )
                                }
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {selectedWalletNFT.metadata.name}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => viewWalletNFTs()}>Update NFT</Button>
                                </CardActions>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Select NFT Image
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Select an NFT Image in your connected wallet from our Approved Projects to add to your merch
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => viewWalletNFTs()}>Select NFT</Button>
                                </CardActions>
                            </Card>
                        )
                    }
                </Grid>
                <Grid item xs={12}>
                    <Grid container direction="row">
                        <Grid item xs={6}>
                            {
                                selectedWalletNFT ? (
                                    <FormControlLabel control={<Checkbox checked={checked} onChange={handleRemoveImageBackgroundChange} />} label="Remove Image Background" />
                                ) : (
                                    <FormControlLabel disabled control={<Checkbox />} label="Remove Image Background" />
                                )
                            }
                            
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <FormControl fullWidth>
                                    <InputLabel id="image-placement-lable">Image Placement</InputLabel>
                                    <Select
                                        labelId="image-placement-lable"
                                        id="image-placement-select"
                                        value={imagePlacement}
                                        label="Image Placement"
                                        onChange={handleImagePlacementChange}
                                    >
                                        {
                                            product.file_placement_options.map((placement) => (
                                                <MenuItem value={placement.id}>{placement.title}</MenuItem>
                                            ))
                                        }

                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Button onClick={() => createMerch()}>
                    Create Merch
                </Button>
            </Grid>
            <Dialog
                fullWidth={true}
                maxWidth="xl"
                open={openWalletNFTs}
            >
                <DialogTitle>Wallet NFTs</DialogTitle>
                <DialogContent>
                    {
                        walletNFTs ? (
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                            >
                                {
                                    walletNFTs.map((nft) => (
                                        <Grid item xs={3} key={nft.token_id}>
                                            <Card onClick={() => selectWalletNFT(nft.token_id)}>
                                                <CardActionArea>
                                                    <CardMedia 
                                                        component="img"
                                                        image={nft.metadata.image}
                                                        alt={nft.metadata.name}
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="div">
                                                            {nft.metadata.name}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    ))
                                }

                            </Grid>
                        ) : (
                            <CircularProgress color="inherit" />
                        )
                    }
                </DialogContent>

            </Dialog>
        </Grid>
    )

}

export async function getServerSideProps(context) {
    const { shirtId } = context.params
    return {
        props: {
            pid: shirtId
        }
    }
}