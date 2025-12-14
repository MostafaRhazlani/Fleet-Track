import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            if (config.headers && config.headers['Content-Type']) delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
export default api;
