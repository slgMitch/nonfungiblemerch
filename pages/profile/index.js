import { Fragment, useState } from 'react'
import {Container, Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image'
import AddProductsStepper from '../../src/components/AddProductsStepper/AddProductsStepper';

function Profile() {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false);
    const [tokens, setTokens] = useState(null);

  
    const handleClose = () => {
      setOpen(false);
    };

    const getWalletNFTsHandler = async () => {
        const { address } = session.user

        const requestData = { address }

        const { data } = await axios.post('/api/nft/wallet-nfts', requestData, {
            headers: {
                'content-type': 'application/json',
            },
        });

        // console.log('response data.metadata', JSON.parse(data[0].metadata))
        console.log('data', data)
        setTokens(data)
        setOpen(true);
    }

    return (
        <Fragment>
            <Container maxWidth='lg'>
                <Box sx={{ bgcolor: '#cfe8fc' }}>
                    <Typography variant="h2" gutterBottom textAlign='center'>
                    Profile Page
                    </Typography>
                    <Button 
                        variant='contained'
                        onClick={getWalletNFTsHandler}
                    >
                        Add NFTs
                    </Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Wallet NFTs</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Select the NFTs you would like to add
                        </DialogContentText>
                        <AddProductsStepper />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleClose}>Add</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Container>
        </Fragment>
    )
}

export default Profile