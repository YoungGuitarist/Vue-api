<template>
  <div>
    <button @click="loadData">Load {{ currentEndpoint }}</button>
    <DataTable
      :table-data="data"
      :loading="loading"
      :error="error"
    />
  </div>
</template>

<script>
import {computed, ref} from 'vue';
import DataTable from '@/components/DataTable.vue';
import useApi from '@/api/api.js';
import {useRoute} from "vue-router";

export default {
  components: {
    DataTable
  },
  setup() {
    const route = useRoute();
    const currentEndpoint = computed(() => {
      return route.path.split('/').pop();
    });
    console.log(currentEndpoint.value);
    const {
      data,
      loading,
      error,
      fetchData: fetchOrders
    } = useApi(currentEndpoint.value);

    const loadData = async () => {
      try {
        await fetchOrders('2025-06-28', '2025-06-30');
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    return {
      data,
      loading,
      error,
      loadData,
      currentEndpoint,
    };
  }
};
</script>

<style>
.error {
  color: red;
}
</style>
