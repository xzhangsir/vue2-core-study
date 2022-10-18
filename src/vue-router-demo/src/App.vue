<template>
  <div id="app">
    <router-link to="/home">home</router-link>
    &nbsp;
    <router-link to="/about">About</router-link>
    <router-view />
  </div>
</template>

<script>
import Hello from './components/Hello.vue'
import About from './components/About.vue'


export default {
  name: 'App',
  mounted(){
    console.log(this._routerRoot._router)
  },
  components: {
    Hello,
    About
  }
}
</script>

<style>

</style>
