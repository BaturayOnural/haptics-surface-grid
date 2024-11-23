<!-- App.vue -->
<template>
  <div id="app">
    <router-view></router-view> <!-- Display the routed component -->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
#app {
  text-align: center;
  margin-top: 20px;
}
</style>