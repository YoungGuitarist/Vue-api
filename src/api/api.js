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

export default function useApi(initialEndpoint) {
  const data = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const page = ref(1);
  const limit = ref(100);
  const totalItems = ref(0);
  const currentEndpoint = ref(initialEndpoint);

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

      const response = await apiClient.get(`/${currentEndpoint.value}`, { params });
      data.value = response.data.data;
      totalItems.value = response.data.total || response.data.data.length;
      return data.value;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const nextPage = () => {
    if (page.value * limit.value < totalItems.value) {
      page.value++;
      return fetchData();
    }
  };

  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
      return fetchData();
    }
  };

  return {
    data,
    loading,
    error,
    page,
    limit,
    totalItems,
    currentEndpoint,
    fetchData,
    nextPage,
    prevPage
  };
}
