import { useState, useEffect } from 'react'
import { 
    Grid,
    Typography,
    Backdrop,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Modal,
    Checkbox,
    FormControlLabel
  } from '@mui/material'
import useSWR from 'swr'
import axios from 'axios'

export default function NFTs(props) {
    const { user } = props
    const fetcher = (url) => fetch(url).then((res) => res.json())
    const url = `/api/profile/nfts/${user}`
    const { data, error } = useSWR(url, fetcher)
    const [nfts, setNfts] = useState()
    const [walletNfts, setWalletNfts] = useState()
    const [selectedWalletNfts, setSelectedWalletNfts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showNftModal, setShowNftModal] = useState(false)
    const [removeImageBackgrounds, setRemoveImageBackgrounds] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        setNfts(data)
        setSelectedWalletNfts(data)
        setIsLoading(false)
    }, [data])

    const displayWalletNfts = async () => {
        setIsLoading(true)
        const requestData = { address: user }
        const { data } = await axios.post('/api/nft/wallet-nfts', requestData, {
            headers: {
                'content-type': 'application/json',
            },
        })
        setWalletNfts(data)
        setIsLoading(false)
        setShowNftModal(true)
    }

    const selectNft = (walletNft) => {
        const isAlreadySelected = selectedWalletNfts && selectedWalletNfts.find(selectedWalletNft => selectedWalletNft.token_id === walletNft.token_id)
        if(isAlreadySelected) {
            setSelectedWalletNfts(selectedWalletNfts.filter(selectedWalletNft => selectedWalletNft.token_id !== isAlreadySelected.token_id))
        } else {
            setSelectedWalletNfts([...selectedWalletNfts, walletNft])
        }
    }

    const saveWalletNfts = async () => {
        setShowNftModal(false)
        setIsLoading(true)
        let nftsToSave
        if(nfts && nfts.length) {
            for(const nft of nfts) {
                nftsToSave = selectedWalletNfts.filter(selectedWalletNft => selectedWalletNft.token_id !== nft.token_id)
            }
        } else {
            nftsToSave = selectedWalletNfts
        }

        const requestData = {
            user,
            nfts: nftsToSave,
            removeImageBackgrounds
        }
        const { data } = await axios.post('/api/profile/nfts/save', requestData, {
            headers: {
                'content-type': 'application/json',
            },
        })
        setNfts(data)
        setSelectedWalletNfts(data)
        setIsLoading(false)
    }

    const handleRemoveImageBackgroundsChange = (event) => {
        console.log('event', event.target.checked)
        setRemoveImageBackgrounds(event.target.checked)
    }

    const closeWalletNftModal = () => {
        setShowNftModal(false)
        setSelectedWalletNfts(nfts)
    }

    if(!data || !nfts || isLoading) {
        return (
            <Backdrop
                open={!nfts || isLoading}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Grid container direction="row">
            <Grid item xs={12}>
                <Typography variant="h3" textAlign='center'>My NFTs</Typography>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
                <Button onClick={() => displayWalletNfts()}>Add NFTs</Button>
            </Grid>
            <Grid item xs={12}>
                {
                    nfts && nfts.length ? (
                        <Grid
                            container
                            spacing={3}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            {
                                nfts.map((nft) => (
                                    <Grid item xs={3} key={nft.token_id}>
                                        <Card 
                                            key={nft.token_id}
                                        >
                                            <CardMedia 
                                                component='img'
                                                image={nft.metadata.image}
                                                alt={nft.metadata.name}
                                            />
                                            <CardContent>
                                                <Typography noWrap gutterBottom component="div">
                                                    Collection: {nft.name}
                                                </Typography>
                                                <Typography noWrap gutterBottom component="div">
                                                    Name: {nft.metadata.name}
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
                                            You haven't added any NFTs yet... Click below to add!
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => displayWalletNfts()}>Add NFTs</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </Grid>
                    )
                }

                <Modal open={showNftModal}>
                    <Grid
                        container 
                        direction="row" 
                        justifyContent="center" 
                        alignContent="center"
                        style={{ minHeight: "100vh" }}
                    >
                        <Grid item xs={8}>
                            <Card sx={{ borderRadius: '16px', top: '50%' }}>
                                <CardContent>
                                    <Typography variant='h4' textAlign='center'>Select NFTs to save</Typography>
                                    <Grid container direction='row'>
                                        {
                                            walletNfts && walletNfts.map((walletNft) => (
                                                <Grid item xs={4} key={walletNft.token_id}>
                                                    <Card
                                                        key={walletNft.token_id} 
                                                        sx={{ 
                                                            margin: '15px', 
                                                            ":hover": { 
                                                                boxShadow: '-1px 10px 29px 0px rgba(0,0,0,0.8);', 
                                                                cursor: 'pointer' 
                                                            },
                                                            boxShadow: selectedWalletNfts && selectedWalletNfts.find(selectedWalletNft => selectedWalletNft.token_id === walletNft.token_id) || nfts && nfts.find(nft => nft.token_id === walletNft.token_id) ? '-1px 10px 29px 0px rgba(0,0,0,0.8);' : ''
                                                        }}
                                                        onClick={() => selectNft(walletNft)}
                                                    >
                                                        <CardMedia 
                                                            sx={{ height: 350 }}
                                                            image={walletNft.metadata.image}
                                                            title={walletNft.metadata.name}
                                                        />
                                                        <CardContent>
                                                            <Typography textAlign='center'>{walletNft.metadata.name}</Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>

                                            ))
                                        }
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Grid  container item xs={6} justifyContent='flex-start'>
                                        <Button onClick={() => closeWalletNftModal()}>Close</Button>
                                        <Button disabled={!selectedWalletNfts.length} onClick={() => saveWalletNfts()}>Save</Button>

                                    </Grid>
                                    <Grid  container item xs={6} justifyContent='flex-end'>
                                        <FormControlLabel
                                            control={
                                                <Checkbox 
                                                    checked={removeImageBackgrounds}
                                                    onChange={handleRemoveImageBackgroundsChange}
                                                />
                                            }
                                            label="Remove background from tokens" 
                                        />
                                    </Grid>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </Modal>

            </Grid>
        </Grid>
    )
}