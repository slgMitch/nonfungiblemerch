import * as React from 'react';
import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import Layout from '../src/components/Layout/Layout'
import { UserContextProvider } from '../store/user-context';


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// client for wagmi config 
const { provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);

const wagmiClient = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});


export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>Non Fungible Merch</title>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <meta name='description' content='Non Fungible Merch' />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <UserContextProvider>
              <Layout />
              <Component {...pageProps} />
            </UserContextProvider>
          </ThemeProvider>
        </CacheProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};