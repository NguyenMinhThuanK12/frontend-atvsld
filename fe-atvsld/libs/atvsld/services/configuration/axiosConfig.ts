import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

console.log("Axios Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
        return Promise.reject({
          message:
            error.response.data.message ||
            "Có lỗi xảy ra từ server. Vui lòng thử lại.",
          status: error.response.status,
        });
      } else if (error.request) {
        return Promise.reject({ message: "Không thể kết nối đến server." });
      } else {
        return Promise.reject({ message: "Đã xảy ra lỗi không xác định." });
      }
    }
);
  
export default api;