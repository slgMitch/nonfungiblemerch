import { createContext, useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

const WalletSessionContext = createContext({
    walletSession: null, // { session: { user: { address, profileId, signature } expires } status }
})

export function WalletSessionContextProvider(props) {
    const [activeWalletSession, setActiveWalletSession] = useState()
    const { data: session, status } = useSession()

    // setTimeout for expired session? 
    // useEffect(() => {

    // }, [])


    // space for handlers
    function setWalletSessionHandler(walletSessionData) {
        setActiveWalletSession(walletSessionData)
    } 

    function removeWalletSessionHandler() {
        setActiveWalletSession(null)
    }


    const context = {
        wallet: activeWalletSession
    }

    return (
        <WalletSessionContext.Provider value={context}>
            {props.children}
        </WalletSessionContext.Provider>
    )
}



export default WalletSessionContext
