<template>
  <div>
    <h1>{{ currentEndpoint.toUpperCase() }}</h1>

    <div class="controls">
      <button @click="loadData" :disabled="loading">
        {{ loading ? 'Загрузка...' : 'Обновить данные' }}
      </button>

      <div class="date-filters">
        <input type="date" v-model="dateFrom" @change="loadData" />
        <input type="date" v-model="dateTo" @change="loadData" />
      </div>
    </div>

    <DataTable
      :table-data="data"
      :loading="loading"
      :error="error"
      :page="page"
      :limit="limit"
      :total-items="totalItems"
      @next-page="nextPage"
      @prev-page="prevPage"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import DataTable from '@/components/DataTable.vue';
import useApi from '@/api/api.js';

export default {
  components: { DataTable },
  setup() {
    const route = useRoute();
    const dateFrom = ref(new Date().toISOString().split('T')[0]);
    const dateTo = ref(new Date().toISOString().split('T')[0]);

    const currentEndpoint = computed(() => route.path.split('/').pop() || 'orders');

    const {
      data,
      loading,
      error,
      page,
      limit,
      totalItems,
      fetchData,
      nextPage,
      prevPage
    } = useApi(currentEndpoint.value);

    const loadData = async () => {
      try {
        await fetchData(dateFrom.value, dateTo.value);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      }
    };

    // Автоматическая загрузка при изменении маршрута
    watch(currentEndpoint, (newEndpoint) => {
      loadData();
    });

    // Первоначальная загрузка
    loadData();

    return {
      data,
      loading,
      error,
      page,
      limit,
      totalItems,
      currentEndpoint,
      dateFrom,
      dateTo,
      loadData,
      nextPage,
      prevPage
    };
  }
};
</script>
