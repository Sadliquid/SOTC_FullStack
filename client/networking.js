import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:5000",
})

instance.interceptors.request.use((config) => {
    config.headers["content-type"] = "multipart/form-data";
    return config;
}, (err) => {
    return Promise.reject(err);
})

export default instance;