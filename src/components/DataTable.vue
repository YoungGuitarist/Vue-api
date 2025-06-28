<template>
  <div class="table-container">
    <!-- Фильтры и контролы -->
    <div class="controls">
      <div class="filters">
        <select v-model="warehouseFilter" @change="applyFilters" class="filter-select">
          <option value="">Все склады</option>
          <option v-for="warehouse in uniqueWarehouses" :key="warehouse" :value="warehouse">
            {{ warehouse }}
          </option>
        </select>

        <select v-model="oblastFilter" @change="applyFilters" class="filter-select">
          <option value="">Все области</option>
          <option v-for="oblast in uniqueOblasts" :key="oblast" :value="oblast">
            {{ oblast }}
          </option>
        </select>

        <button @click="resetFilters" class="reset-button">Сбросить фильтры</button>
      </div>

      <div class="pagination-controls">
        <div class="limit-control">
          <label for="items-per-page">Элементов на странице:</label>
          <select
            id="items-per-page"
            v-model="localLimit"
            @change="handleLimitChange"
            class="limit-select"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div class="page-controls">
          <button
            @click="$emit('prev-page')"
            :disabled="page === 1 || loading"
            class="page-button"
          >
            Назад
          </button>
          <span class="page-info">Страница {{ page }} из {{ totalPages }}</span>
          <button
            @click="$emit('next-page')"
            :disabled="page >= totalPages || loading"
            class="page-button"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>

    <!-- Таблица -->
    <table class="data-table">
      <thead>
      <tr>
        <th v-for="header in headers" :key="header.key">
          {{ header.title }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in filteredData" :key="index">
        <td v-for="header in headers" :key="header.key">
          {{ formatValue(item[header.key], header.key) }}
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Состояния -->
    <div v-if="loading" class="loading">
      <div class="loader"></div>
      Загрузка данных...
    </div>
    <div v-if="error" class="error">
      Ошибка: {{ error }}
    </div>
    <div v-if="!loading && !error && filteredData.length === 0" class="empty">
      Нет данных для отображения
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'DataTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 50
    },
    totalItems: {
      type: Number,
      default: 0
    }
  },
  emits: ['next-page', 'prev-page', 'update:limit', 'filter-change'],

  setup(props, { emit }) {
    const headers = [
      { key: 'g_number', title: 'Номер заказа' },
      { key: 'date', title: 'Дата' },
      { key: 'supplier_article', title: 'Артикул поставщика' },
      { key: 'tech_size', title: 'Размер' },
      { key: 'barcode', title: 'Штрихкод' },
      { key: 'total_price', title: 'Цена' },
      { key: 'discount_percent', title: 'Скидка %' },
      { key: 'warehouse_name', title: 'Склад' },
      { key: 'oblast', title: 'Область' },
      { key: 'nm_id', title: 'Номер WB' },
      { key: 'subject', title: 'Предмет' },
      { key: 'category', title: 'Категория' },
      { key: 'brand', title: 'Бренд' },
      { key: 'is_cancel', title: 'Отменен' },
    ];

    const warehouseFilter = ref('');
    const oblastFilter = ref('');
    const localLimit = ref(props.limit);
    const filteredData = ref([]);

    // Уникальные значения для фильтров
    const uniqueWarehouses = computed(() => {
      return [...new Set(props.tableData.map(item => item.warehouse_name))].filter(Boolean);
    });

    const uniqueOblasts = computed(() => {
      return [...new Set(props.tableData.map(item => item.oblast))].filter(Boolean);
    });

    // Форматирование значений
    const formatValue = (value, key) => {
      if (value === null || value === undefined) return '-';

      switch (key) {
        case 'date':
          return new Date(value).toLocaleString();
        case 'is_cancel':
          return value ? 'Да' : 'Нет';
        case 'total_price':
          return `${value.toLocaleString()} ₽`;
        case 'discount_percent':
          return `${value}%`;
        default:
          return value.toString();
      }
    };

    // Вычисляемые свойства
    const totalPages = computed(() => Math.ceil(props.totalItems / props.limit));
    const shownItemsStart = computed(() => (props.page - 1) * props.limit + 1);
    const shownItemsEnd = computed(() => {
      const end = props.page * props.limit;
      return end > props.totalItems ? props.totalItems : end;
    });

    // Фильтрация данных
    const applyFilters = () => {
      filteredData.value = props.tableData.filter(item => {
        const matchesWarehouse = !warehouseFilter.value ||
          item.warehouse_name === warehouseFilter.value;
        const matchesOblast = !oblastFilter.value ||
          item.oblast === oblastFilter.value;
        return matchesWarehouse && matchesOblast;
      });

      emit('filter-change', {
        warehouse: warehouseFilter.value,
        oblast: oblastFilter.value
      });
    };

    // Сброс фильтров
    const resetFilters = () => {
      warehouseFilter.value = '';
      oblastFilter.value = '';
      applyFilters();
    };

    // Обработчик изменения лимита
    const handleLimitChange = () => {
      emit('update:limit', Number(localLimit.value));
    };

    // Автоматически применяем фильтры при изменении данных
    watch(() => props.tableData, () => {
      filteredData.value = [...props.tableData];
      applyFilters();
    }, { immediate: true });

    // Следим за внешними изменениями limit
    watch(() => props.limit, (newVal) => {
      localLimit.value = newVal;
    });

    return {
      headers,
      warehouseFilter,
      oblastFilter,
      localLimit,
      filteredData,
      uniqueWarehouses,
      uniqueOblasts,
      totalPages,
      shownItemsStart,
      shownItemsEnd,
      formatValue,
      applyFilters,
      resetFilters,
      handleLimitChange
    };
  }
};
</script>

<style scoped>
.table-container {
  margin: 20px;
  overflow-x: auto;
  position: relative;
  min-height: 200px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}

.reset-button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #e0e0e0;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.limit-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.limit-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.page-button {
  padding: 6px 12px;
  min-width: 80px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #555;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 14px;
}

.data-table th,
.data-table td {
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: left;
}

.data-table th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  font-weight: 500;
  color: #333;
}

.data-table tr:nth-child(even) {
  background-color: #fafafa;
}

.data-table tr:hover {
  background-color: #f0f0f0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
  gap: 15px;
}

.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  padding: 20px;
  margin: 20px 0;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
  text-align: center;
}

.empty {
  padding: 40px;
  text-align: center;
  color: #777;
  font-size: 16px;
}

@media (max-width: 768px) {
  .pagination-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-select {
    width: 100%;
  }
}
</style>
