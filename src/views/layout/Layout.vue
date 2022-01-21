<template>
  <div class="container">
    <Header></Header>
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./Header";
import Footer from "./Footer";
export default {
  data() {
    return {};
  },
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="less">
.container {
  padding-top: 68px;

}

</style>
