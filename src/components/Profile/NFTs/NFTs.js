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
    ToggleButton,
    Tooltip,
    Button,
    Modal
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
    const [isLoading, setIsLoading] = useState(false)
    const [showNftModal, setShowNftModal] = useState(false)

    useEffect(() => {
        console.log('nfts data', data)
        setIsLoading(true)
        setNfts(data)
        setIsLoading(false)
    }, [data])

    const displayWalletNfts = async () => {
        const requestData = { address: user }
        const { data } = await axios.post('/api/nft/wallet-nfts', requestData, {
            headers: {
                'content-type': 'application/json',
            },
        });
        console.log('wallet nfts', data)
        setWalletNfts(data)
        setShowNftModal(true)
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
                <Button>Add NFTs</Button>
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
                                    <Grid item xs={3} key={nft.id}>
                                        <Card 
                                            key={nft.id}
                                        >
                                            <CardMedia 
                                                component='img'
                                                image={nft.image}
                                                alt={nft.name}
                                            />
                                            <CardContent>
                                                <Typography noWrap gutterBottom component="div">
                                                    {nft.name}
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
                            <Modal
                                open={showNftModal}
                            >
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
                                                            <Grid item xs={4}>
                                                                <Card 
                                                                    sx={{ 
                                                                        margin: '15px', 
                                                                        ":hover": { 
                                                                            boxShadow: '-1px 10px 29px 0px rgba(0,0,0,0.8);', 
                                                                            cursor: 'pointer' 
                                                                        },
                                                                        
                                                                        ":onclick": {
                                                                            boxShadow: '-1px 10px 29px 0px rgba(0,0,0,0.8);', 
                                                                        }
                                                                         
                                                                    }}
                                                                    // onClick={() => handleAuth('metamask')}
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
                                                <Button onClick={() => setShowNftModal(false)}>Close</Button>
                                            </CardActions>

                                        </Card>
                                    </Grid>

                                </Grid>

                            </Modal>

                        </Grid>
                    )
                }

            </Grid>
        </Grid>
    )
}