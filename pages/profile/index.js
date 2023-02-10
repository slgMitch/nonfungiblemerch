import { useState } from 'react'
import { 
    Backdrop,
    Button,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    Grid,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemButton,
    ListItemText,
    Modal,
    CardMedia
  } from '@mui/material'
import TokenIcon from '@mui/icons-material/Token'
import CategoryIcon from '@mui/icons-material/Category'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import axios from 'axios';
import Settings from '../../src/components/Profile/Settings/Settings'
import Products from '../../src/components/Profile/Products/Products'
import NFTs from '../../src/components/Profile/NFTs/NFTs'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi'
import { useRouter } from 'next/router'

function Profile() {
    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { data: session } = useSession()
    const { push, pathname } = useRouter();
    const [activeProfileComponent, setActiveProfileComponent] = useState('products')
    const [showWalletOptions, setShowWalletOptions] = useState(false)
    const profileActionOptions = [{text: 'Products', component: 'products'}, {text: 'NFTs', component: 'nfts'}]
    const profileManagementOptions = [{text: 'Settings', component: 'settings'}, {text: 'Sign Out', component: 'signOut'}]
    const [isLoading, setIsLoading] = useState()
    const [isError, setIsError] = useState()


    const handleAuth = async (wallet) => {
        if (isConnected) {
            await disconnectAsync();
        }
    
        try {
          const { account, chain } = await setWalletAccountAndChain(wallet)
    
          const userData = { address: account, chain: chain.id, network: 'evm' };
      
          setIsLoading(true)
          const { data, error } = await axios.post('/api/auth/request-message', userData, {
              headers: {
                  'content-type': 'application/json',
              },
          });
          console.log('profile data', data);
          console.log('profile data error', error);
      
          const message = data.message;
      
          const signature = await signMessageAsync({ message });
      
          // redirect user after success authentication to '/user' page
          const { url } = await signIn('credentials', { message, signature, redirect: false, callbackUrl: pathname });
          /**
           * instead of using signIn(..., redirect: "/user")
           * we get the url from callback and push it to the router to avoid page refreshing
           */
        //   userCtx.setActiveUser({ address: account })
          push(url);
          setIsLoading(false)
        } catch (error) {
          console.log('there was an error authenticating', error)
          setIsError(error)
        }
    }

    const setWalletAccountAndChain = async (wallet) => {
        if(wallet === 'walletconnect') {
          const { account, chain } = await connectAsync({
              connector: new WalletConnectConnector({
                  options: {
                      qrcode: true,
                  },
              }),
          });
          return { account, chain }
        } else if (wallet === 'metamask') {
          const { account, chain } = await connectAsync({ connector: new MetaMaskConnector() })
          return { account, chain }
    
        } else if (wallet === 'coinbase') {
          const { account, chain } = await connectAsync({
            connector: new CoinbaseWalletConnector({
              options: {
                appName: 'nfm',
              },
            }),
          });
          return { account, chain }
        } else {
          const { account, chain } = await connectAsync({
            connector: new WalletConnectConnector({
                options: {
                    qrcode: true,
                },
            }),
          });
          return { account, chain }
        }
    }


    const handleActionOption = (actionOption) => {
        setActiveProfileComponent(actionOption.component)
    }

    const handleManagementOption = (managementOption) => {
        if(managementOption.component === 'signOut') {
            signOut({ redirect: '/' })
            push('/')
        } else {
            setActiveProfileComponent(managementOption.component)
        }

    }


    const renderSwitch = (activeProfileComponent) => {
        switch(activeProfileComponent) {
            case 'products':
                return <Products user={session.user.address} />
            case 'nfts':
                return <NFTs user={session.user.address} />
            case 'settings':
                return <Settings user={session.user.address} />
        }
    }

    const closeWalletModal = () => {
        setShowWalletOptions(false)
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
                            <Button onClick={() => setShowWalletOptions(true)}>Connect Wallet</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Modal
                    open={showWalletOptions}
                    onClose={closeWalletModal}
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
                                    <Typography variant='h4' textAlign='center'>Choose Wallet to Connect</Typography>
                                    <Grid container direction='row'>
                                        <Grid item xs={4}>
                                            <Card 
                                                sx={{ margin: '15px', ":hover": { boxShadow: '-1px 10px 29px 0px rgba(0,0,0,0.8);', cursor: 'pointer' } }}
                                                onClick={() => handleAuth('metamask')}
                                            >
                                                <CardMedia 
                                                    sx={{ height: 350 }}
                                                    image="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
                                                    title="MetaMask"
                                                />
                                                <CardContent>
                                                    <Typography textAlign='center'>Connect MetaMask Wallet</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Card 
                                                sx={{ margin: '15px', ":hover": { boxShadow: '-1px 10px 29px 0px rgba(0,0,0,0.8);', cursor: 'pointer' } }}
                                                onClick={() => handleAuth('walletconnect')}
                                            >
                                                <CardMedia 
                                                    sx={{ height: 350 }}
                                                    image="https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo.jpg"
                                                    title="MetaMask"
                                                />
                                                <CardContent>
                                                    <Typography textAlign='center'>Connect Using WalletConnect</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Card 
                                                sx={{ margin: '15px', ":hover": { boxShadow: '-1px 10px 29px 0px rgba(0,0,0,0.8);', cursor: 'pointer' } }}
                                                onClick={() => handleAuth('coinbase')}
                                            >
                                                <CardMedia 
                                                    sx={{ height: 350 }}
                                                    image="https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0"
                                                    title="MetaMask"
                                                />
                                                <CardContent>
                                                    <Typography textAlign='center'>Connect CoinbaseWallet</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => setShowWalletOptions(false)}>Close</Button>
                                </CardActions>

                            </Card>
                        </Grid>

                    </Grid>

                </Modal>
            </Grid>
        )
    }

    const profilePage = () => {
        return (
            <Grid container direction='row'>
                <Grid item xs={2}>
                    <List>
                        {
                            profileActionOptions.map((actionOption) => (
                                <ListItem key={actionOption.component} disablePadding>
                                    <ListItemButton onClick={() => handleActionOption(actionOption)}>
                                        <ListItemIcon>
                                            { actionOption.component === 'nfts' ? <TokenIcon /> : <CategoryIcon /> }
                                        </ListItemIcon>
                                        <ListItemText primary={actionOption.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </List>
                    <Divider />
                    <List>
                        {
                            profileManagementOptions.map((managementOption) => (
                                <ListItem key={managementOption.component} disablePadding>
                                    <ListItemButton onClick={() => handleManagementOption(managementOption)}>
                                        <ListItemIcon>
                                            { managementOption.component === 'settings' ? <SettingsIcon /> : <LogoutIcon /> }
                                        </ListItemIcon>
                                        <ListItemText primary={managementOption.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </List>
                </Grid>
                <Grid item xs={10}>
                    {renderSwitch(activeProfileComponent)}
                </Grid>
            </Grid>
        )
    }


    if(isLoading) {
        return (
            <Backdrop
                open={isLoading}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    if(isError) {
        console.log('show isError', isError)
        setIsError(false)
        alert(isError)
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