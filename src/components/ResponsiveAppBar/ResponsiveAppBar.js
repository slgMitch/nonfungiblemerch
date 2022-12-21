import * as React from 'react';
import { useState, useContext } from 'react'
import { 
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Badge
} from '@mui/material'
import AdbIcon from '@mui/icons-material/Adb';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSnipcart } from 'use-snipcart';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { useRouter } from 'next/router';
import axios from 'axios';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

const pages = [{ name: 'Apparel', href: '/apparel' }, { name: 'Accessories', href: '/accessories' }, { name: 'Prints', href: '/prints' }, { name: 'Projects', href: '/projects' },];
const profileOptions = ['Profile', 'My Merch', 'Logout'];
const walletOptions = ['Wallet Connect', 'MetaMask', 'Coinbase Wallet']

function ResponsiveAppBar() {
  const { cart = {} } = useSnipcart();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElWallet, setAnchorElWallet] = useState(null);
  const [walletAccount, setWalletAccount] = useState()
  const [walletChain, setWalletChain] = useState()
  const { push, pathname } = useRouter();
  const { data: session, status } = useSession()

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenWalletMenu = (event) => {
    setAnchorElWallet(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseWalletMenu = () => {
    setAnchorElWallet(null);
  };

  const openShoppingCart = () => {
    Snipcart.api.theme.cart.open()
  }

  const handleProfileOption = async (option) => {
    switch (option) {
      case 'Profile':
        push('/profile')
        break;
  
      case 'My Merch':
        const {address} = session.user
        push(`/merch/${address}`)
        break;
  
      case 'Logout':
        await disconnectAsync();
        userCtx.removeActiveUser()
        signOut()
        push('/')
        break;
    
      default:
        break;
    }
  }

  const setWalletAccountAndChain = async (wallet) => {
    if(wallet === 'Wallet Connect') {
      const { account, chain } = await connectAsync({
          connector: new WalletConnectConnector({
              options: {
                  qrcode: true,
              },
          }),
      });
      return { account, chain }
    } else if (wallet === 'MetaMask') {
      const { account, chain } = await connectAsync({ connector: new MetaMaskConnector() })
      return { account, chain }

    } else if (wallet === 'Coinbase Wallet') {
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

  const handleAuth = async (wallet) => {
    if (isConnected) {
        await disconnectAsync();
    }

    try {
      const { account, chain } = await setWalletAccountAndChain(wallet)

      const userData = { address: account, chain: chain.id, network: 'evm' };
  
      const { data } = await axios.post('/api/auth/request-message', userData, {
          headers: {
              'content-type': 'application/json',
          },
      });
  
      const message = data.message;
  
      const signature = await signMessageAsync({ message });
  
      // redirect user after success authentication to '/user' page
      const { url } = await signIn('credentials', { message, signature, redirect: false, callbackUrl: pathname });
      /**
       * instead of using signIn(..., redirect: "/user")
       * we get the url from callback and push it to the router to avoid page refreshing
       */
      userCtx.setActiveUser({ address: account })
      push(url);
    } catch (e) {
      console.log('there was an error', e)
    }
  }

  const navigateToMyProfile = () => {
    push('/profile')
  }

  return (
    <AppBar sx={{ borderRadius: '16px' }} position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Link href='/'>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              NFM
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link 
                key={page.href}
                href={page.href}
              >
                <Button
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                  </Button>
                </Link>
            ))}
          </Box>
          <Box>
            <Button
              key="profile"
              onClick={navigateToMyProfile}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              My Profile
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton 
              size="large"
              color="inherit"
              onClick={openShoppingCart} 
              sx={{ 
                p: 0,
                padding: '15px'
              }}
            >
              <Badge badgeContent={cart.items?.count} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            {/* {
              session ? (
                <>
                  <Tooltip title="Open Profile settings">
                    <IconButton 
                      onClick={handleOpenUserMenu} 
                      sx={{ 
                        p: 0,
                        padding: '15px'
                      }}
                    >
                      <Avatar />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="profile-menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {profileOptions.map((option) => (
                      <MenuItem key={option} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" onClick={() => handleProfileOption(option)}>{option}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <>
                  <Tooltip title="Connect your Wallet">
                    <Button
                      onClick={handleOpenWalletMenu}
                      sx={{ my: 2, color: 'blue', display: 'block', p: 0 }}
                    >
                      Connect Wallet
                    </Button>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="wallet-menu-appbar"
                    anchorEl={anchorElWallet}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElWallet)}
                    onClose={handleCloseWalletMenu}
                  >
                    {
                      walletOptions.map((wallet) => (
                        <MenuItem key={wallet} onClick={handleCloseWalletMenu}>
                          <Typography 
                            textAlign="center"
                            onClick={() => handleAuth(wallet)}
                          >
                            {wallet}
                          </Typography>
                        </MenuItem>
                      ))
                    }

                  </Menu>
                </>
              )
            } */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;