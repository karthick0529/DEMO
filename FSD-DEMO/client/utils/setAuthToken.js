import instance from "./http";

// Getting the token from Node to React
const setAuthToken = (token) => {
    if (token) {
        instance.defaults.headers.authorization = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.authorization;
    }
};

export default setAuthToken;