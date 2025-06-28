<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
      <tr>
        <th v-for="header in headers" :key="header.key">
          {{ header.title }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in tableData" :key="index">
        <td v-for="header in headers" :key="header.key">
          {{ formatValue(item[header.key], header.key) }}
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="loading" class="loading">Загрузка данных...</div>
    <div v-if="error" class="error">Ошибка загрузки данных: {{ error }}</div>
    <div v-if="!loading && !error && !tableData.length">Данные не загружены</div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    tableData: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      headers: [
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
      ]
    }
  },
  methods: {
    formatValue(value, key) {
      if (value === null || value === undefined) return '-';

      switch (key) {
        case 'date':
          return new Date(value).toLocaleString();
        case 'is_cancel':
          return value ? 'Да' : 'Нет';
        case 'total_price':
          return `${value} ₽`;
        default:
          return value;
      }
    }
  }
}
</script>

<style scoped>
.table-container {
  margin: 20px;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.data-table th {
  background-color: #f2f2f2;
  position: sticky;
  top: 0;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tr:hover {
  background-color: #f1f1f1;
}

.loading, .error {
  padding: 10px;
  margin-top: 10px;
  text-align: center;
}

.loading {
  color: #666;
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
}
</style>
