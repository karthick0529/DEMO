import React, {createContext, useContext} from 'react';
import setAuthToken from '../../utils/setAuthToken';
import { jwtDecode } from "jwt-decode";

const TokenContext = createContext();

function TokenProvider({children}){
    let logUser;
    if(localStorage.token){
        const jwt = localStorage.getItem('token');
        setAuthToken(jwt);
        logUser = jwtDecode(jwt)
    }
    return (
        <TokenContext.Provider value={logUser}>
            {children}
        </TokenContext.Provider>
      )
}

export const useToken = () => {
    return useContext(TokenContext);
}

export default TokenProvider;