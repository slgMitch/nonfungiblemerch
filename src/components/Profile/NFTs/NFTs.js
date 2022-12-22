import { useState, useEffect } from 'react'
import { 
    Grid,
    Typography,
    Backdrop,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
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
                {/* {
                    nfts && nfts.length ? () : ()
                } */}

            </Grid>
        </Grid>
    )
}