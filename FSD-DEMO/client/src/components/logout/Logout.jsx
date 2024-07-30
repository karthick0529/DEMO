import React, { useEffect } from 'react'

function Logout() {
    useEffect(() => {
        localStorage.removeItem("token");
        window.location = "/";
    }, [])
    return null;
}

export default Logout