import axios from "axios";
import { ref } from "vue";

const API_URL = 'http://109.73.206.144:6969/api';
const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default function useApi(endpoint) {
  const data = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const page = ref(1);
  const limit = ref(500);

  const fetchData = async (dateFrom = '', dateTo = '') => {
    loading.value = true;
    error.value = null;

    try {
      const params = {
        dateFrom,
        dateTo,
        page: page.value,
        limit: limit.value,
        key: API_KEY
      };

      const response = await apiClient.get(`/${endpoint}`, { params });
      data.value = response.data.data;
      return data.value;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    page,
    limit,
    fetchData
  };
}
