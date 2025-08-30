import axios from "axios";

const baseURL = import.meta.env.VITE_APP_URL ? 
    import.meta.env.VITE_APP_URL + "/api/" : 
    "http://localhost:8000/api/";

// CSRF destekli API client
const apiClientWithCSRF = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    timeout: 10000,
    withCredentials: true, // CSRF için gerekli
});

// CSRF token almak için function
export const getCsrfToken = async (): Promise<void> => {
    try {
        // Laravel'den CSRF cookie alıyoruz
        await apiClientWithCSRF.get('/sanctum/csrf-cookie', {
            baseURL: import.meta.env.VITE_APP_URL || 'http://localhost:8000'
        });
    } catch (error) {
        console.error('CSRF token alma hatası:', error);
    }
};

// CSRF token'ı cookie'den okuma
const getCSRFTokenFromCookie = (): string | null => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// Request interceptor - CSRF token'ını otomatik ekle
apiClientWithCSRF.interceptors.request.use(
    (config) => {
        const csrfToken = getCSRFTokenFromCookie();
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClientWithCSRF.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 419) {
            // CSRF token expired, yeniden al
            console.warn('CSRF token süresi dolmuş, yenileniyor...');
            await getCsrfToken();
            
            // Original request'i tekrar dene
            const originalRequest = error.config;
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                const newCsrfToken = getCSRFTokenFromCookie();
                if (newCsrfToken) {
                    originalRequest.headers['X-XSRF-TOKEN'] = newCsrfToken;
                    return apiClientWithCSRF(originalRequest);
                }
            }
        }
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            delete apiClientWithCSRF.defaults.headers.common['Authorization'];
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default apiClientWithCSRF;
