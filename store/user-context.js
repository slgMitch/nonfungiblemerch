import { createContext, useState } from 'react';
import { useSession } from 'next-auth/react';

const UserContext = createContext({
    user: null,
    setActiveUser: function(userData) {},
    removeActiveUser: function() {}
});

export function UserContextProvider(props) {
    const [activeUser, setActiveUser] = useState()

    function setActiveUserHandler(userData) {
        setActiveUser(userData)
    }

    function removeActiveUserHandler() {
        setActiveUser(null)
    }

    const context = {
        user: activeUser,
        setActiveUser: setActiveUserHandler,
        removeActiveUser: removeActiveUserHandler
    }

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext;