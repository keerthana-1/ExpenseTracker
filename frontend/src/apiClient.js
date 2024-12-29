import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Your backend base URL
});

// Add an interceptor to include the token in the Authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
