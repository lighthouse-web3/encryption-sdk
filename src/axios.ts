// Import Axios
import axios from 'axios';
import config from './config';

// Create an Axios instance
const api = axios.create({
    baseURL: config.isDev ? config.lighthouseBLSNodeDev : config.lighthouseAuthNode,
    headers: {
        "Content-Type": "application/json",
    },
});

// Export the instance for use in other files
export default api;