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
  color: #363636;
  width: 100%;
  height: auto;
}
body{
  margin: 0;
  padding: 0;

}
.el-message--error{
  font-family: 'Open-Sans'
}
.v-modal{
  z-index: 200 !important;
}
.el-loading-mask{
  background-color: rgba(0, 0, 0, 0.8) !important;
  z-index: 2001 !important;
}
</style>
