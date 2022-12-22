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
    Button
  } from '@mui/material'
import useSWR from 'swr'

export default function NFTs(props) {
    const { user } = props
    const fetcher = (url) => fetch(url).then((res) => res.json())
    const url = `/api/profile/nfts/${user}`
    const { data, error } = useSWR(url, fetcher)
    const [nfts, setNfts] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        console.log('nfts data', data)
        setIsLoading(true)
        setNfts(data)
        setIsLoading(false)
    }, [data])

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
                                        <Button>Add NFTs</Button>
                                    </CardActions>
                                </Card>
                            </Grid>

                        </Grid>
                    )
                }

            </Grid>
        </Grid>
    )
}