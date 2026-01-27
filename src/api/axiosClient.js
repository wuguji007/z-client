import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// 如果在生產環境抓不到網址，印出警告
if (import.meta.env.PROD && !API_BASE_URL) {
    console.error("錯誤：找不到 VITE_API_URL 環境變數！請檢查部署設定。");
}

//建立 Axios 實例 (Instance)
const axiosClient = axios.create({
    baseURL: API_BASE_URL || '',
    headers: { 'Content-Type': 'application/json' },
});

//請求攔截
axiosClient.interceptors.request.use((config) => {
    
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

// 回應攔截：Token 失效自動登出
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
)

export default axiosClient;