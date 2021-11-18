<template>
  <div id="app">
    <router-view :key="key" v-if="$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
    computed: {
    key() {
      return this.$route.fullPath;
    }
  },
  components: {},
};
</script>

<style lang="less">

#app {
  font-family: 'Open-Sans',Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}
body{
  margin: 0;
  padding: 0;

}

</style>
