<template>
  <div class="About">
    <h1>About</h1>
    <router-link to = "/about/a">去 A 页面</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'About',
}
</script>
<style scoped>

</style>
