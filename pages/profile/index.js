import { Fragment, useState } from 'react'
import { 
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Drawer,
    Toolbar,
    Divider
  } from '@mui/material';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image'
import AddProductsStepper from '../../src/components/AddProductsStepper/AddProductsStepper';

function Profile() {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false);
    const [tokens, setTokens] = useState(null);
    console.log('session', session)
    const profileActionOptions = ['NTFs', 'Products']
    const profileManagementOptions = ['Settings', 'Sign Out']

  
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

    const signInCard = () => {
        return (
            <Grid 
                container 
                direction="row" 
                justifyContent="center" 
                alignContent="center"
                style={{ minHeight: "100vh" }}
            >
                <Grid item xs={6}>
                    <Card sx={{ borderRadius: '16px', top: '50%' }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom textAlign="center">
                                Connect wallet to view your Profile
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button>Connect Wallet</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        )
    }

    const profilePage = () => {
        return (
            <Grid 
                container
                direction="row"
            >
                <Grid item xs={3}>
                    <Drawer
                        sx={{
                            width: 240,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                              width: 240,
                              boxSizing: 'border-box',
                            },
                          }}
                          variant="permanent"
                          anchor="left"
                    >
                        <Toolbar />
                        <Divider />
                        <List>

                        </List>

                    </Drawer>
                </Grid>
                <Grid item xs={9}>
                    My Profile components

                </Grid>

            </Grid>
        )
    }

    return (
        <Grid container>
            {
                session ? (
                    profilePage()
                ) : (
                    signInCard()
                )
            }
        </Grid>

    )
}

export default Profile