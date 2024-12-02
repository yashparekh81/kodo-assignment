import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor for adding token to headers
api.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      Accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    alert(`API Error: ${error.response?.data?.status_message}`);
    return Promise.reject(error);
  }
);

export const fetchMovies = async (payload) => {
  const { page, query } = payload;
  let response;
  if (query) {
    response = await api.get(`/search/movie`, { params: { query, page } });
  } else {
    response = await api.get(`/movie/popular`, { params: { page } });
  }
  return response.data;
};
