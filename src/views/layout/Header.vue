<template>
  <div class="header-container">
    <router-link to="/">
      <div class="logo">
        <img src="../../assets/header-logo.png" height="55px" />
      </div>
    </router-link>
    <router-link to="/">
      <div class="title" :class="currentPath === '/' ? 'title-active' : ''">
        HOME
      </div>
    </router-link>
    <router-link to="/market">
      <div
        class="title"
        :class="currentPath === '/market' ? 'title-active' : ''"
      >
        MARKET
      </div>
    </router-link>
    <div class="search-bar">
      <el-input
        v-model="searchKey"
        placeholder=""
        @focus="focusSearch"
        @blur.prevent="blurSearchBar"
        ref="searchInput"
      ></el-input>
      <div class="placeholder" v-show="showSearchIcon" @click="focusSearch">
        <img
          class="search-icon"
          src="../../assets/icons/search.png"
          width="22px"
        />
        <div>Search files...</div>
      </div>
      <div class="search-icon2" v-show="!showSearchIcon" @mousedown="searchFiles">
        <img src="../../assets/icons/search2.png" width="22px" />
      </div>
    </div>
    <div class="login-box nav-menu">
      <div class="login-btn" v-if="!isLogined" @click.stop="authorization()">
        <img src="../../assets/icons/logo-icon.png" width="15px" />
        Log in
      </div>

      <div class="user-center" v-else style="min-width: 60px">
        <div
          class="language-selector"
          @click="
            $store.state.userInfo.userInfoVisible =
              !$store.state.userInfo.userInfoVisible
          "
        >
          <img :src="imgUrl" alt="" class="user-avatar" :onerror="errorImg" />
          <!-- <Identicon :size="128" :theme="'polkadot'" :value="account" /> -->
          <span class="username">{{
            $store.state.userInfo.data.myAddress
          }}</span>
          <img
            src="../../assets/icons/icon_xia.png"
            class="arrow"
            width="12px"
          />
        </div>
      </div>
      <CustomDropDown
        :items="userOperator"
        :visible.sync="$store.state.userInfo.userInfoVisible"
        :kind="'normal'"
        :height="158"
      />
      <CustomDropDown
        :items="$store.state.userInfo.accountOperator"
        :visible.sync="$store.state.userInfo.accountsVisible"
        :kind="'accounts'"
        :height="268"
      />
    </div>
  </div>
</template>

<script>
import Identicon from "@polkadot/vue-identicon";
import { mapActions, mapGetters } from "vuex";
import CustomDropDown from "../../components/customDropDown.vue";
export default {
  data() {
    return {
      searchBarFlag: false,
      userOperator: [
        {
          icon: require("../../assets/icons/icon-mydata.png"),
          text: "My data",
          callback: () => {
            this.$router.push("/myCloud");
          },
        },
        {
          icon: require("../../assets/icons/icon-logout.png"),
          text: "Log Out",
          callback: () => {
            this.logout();
          },
        },
      ],
      accountOperator: [],
      imgUrl: require("../../assets/icons/default-avater.png"),
      errorImg: "",
      account: null,
      searchKey: "",
      showSearchIcon: true,
      accountList: [],
      currentPath: "",
    };
  },
  computed: {
    ...mapGetters(["isLogined"]),
  },
  watch: {},
  components: {
    CustomDropDown,
    Identicon,
  },

  mounted() {
    this.currentPath = this.$route.path;
  },
  methods: {
    authorization() {
      this.$store.dispatch("userInfo/authorization");
    },
    focusSearch() {
      this.$refs.searchInput.focus();
      this.showSearchIcon = false;
    },
    blurSearchBar() {
      this.showSearchIcon = true;
      this.searchKey = "";
    },
    searchFiles() {
      this.$router.push({
        path: "/market",
        query: {
          keyword: this.searchKey,
        },
      });
    },
    ...mapActions("userInfo", ["logout"]),
  },
};
</script>

<style scoped lang="less">
.header-container {
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  border-bottom: 2px solid #d7d7d7;
  padding: 0 20px;
  position: fixed;
  z-index: 99;
  width: 100%;
  box-sizing: border-box;
  background: white;
  top: 0px;
  a {
    text-decoration: none;
  }
  .logo {
    margin-right: 55px;
  }
  .title {
    font-size: 24px;
    font-family: "AlegreyaSansSC-ExtraBold";
    font-weight: 800;
    line-height: 67px;
    color: #5078fe;
    position: relative;
    margin-right: 20px;
  }
  .title-active {
    border-bottom: 2px solid #5078fe;
  }

  .search-bar {
    width: 521px;
    height: 44px;
    background: #ffffff;
    position: absolute;
    left: 50%;
    margin-left: -260px;
    .placeholder {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: absolute;
      left: 50%;
      top: 50%;
      font-weight: 500;
      line-height: 50px;
      transform: translate(-50%, -50%);
      font-size: 16px;
      color: #9f9f9f;
      font-weight: 500;
      line-height: 50px;
      cursor: text;
    }
    .search-icon {
      margin-right: 10px;
    }
    .search-icon2 {
      position: absolute;
      right: 20px;
      top: 25%;
    }
    /deep/.el-input__inner {
      font-size: 16px;
      color: #9f9f9f;
      font-weight: 500;
      line-height: 50px;
      border: 1px solid #dbdbdb;
      border-radius: 24px;
      height: 44px;
      width: 100%;
    }
  }
  .login-box {
    position: absolute;
    right: 20px;
    .login-btn {
      width: 128px;
      height: 44px;
      background: #f6f7fb;
      border-radius: 24px;
      font-size: 18px;
      line-height: 44px;
      color: #303030;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-btn img {
      margin-right: 17px;
    }
  }
  .user-center {
    text-align: center;
    color: #303030;
    font-size: 12px;
    width: 177px;
    height: 45px;
    line-height: 45px;
    background: #f6f7fb;
    border-radius: 25px;
    padding: 0px 7px;
    box-sizing: border-box;
  }
  .language-selector {
    display: flex;
    align-items: center;
    .user-avatar {
      vertical-align: middle;
      margin-right: 5px;
      height: 33px;
      min-width: 33px;
      vertical-align: middle;
      background: white;
      border-radius: 50%;
      img {
        margin-right: 9px;
      }
    }
    .username {
      width: 70px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .arrow {
      position: absolute;
      right: 18px;
    }
  }
}
</style>
