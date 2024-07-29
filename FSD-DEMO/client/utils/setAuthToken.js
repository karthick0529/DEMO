import instance from "./http";

// Getting the token from Node to React
const setAuthToken = (token) => {
    if (token) {
        instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common.Authorization;
    }
};

export default setAuthToken;