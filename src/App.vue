<template>
  <div>
    <nav>
      <router-link to="/incomes">Incomes</router-link>
      <router-link to="/orders">Order</router-link>
      <router-link to="/sales">Sales</router-link>
      <router-link to="/stocks">Stock</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
nav {
  padding: 20px;
  text-align: center;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav a.router-link-exact-active {
  color: #42b983;
}
</style>
