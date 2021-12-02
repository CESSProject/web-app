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
    <div class="search-bar" v-show="currentPath !== '/'">
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
        <div>Search in the data market</div>
      </div>
      <div
        class="search-icon2"
        v-show="!showSearchIcon"
        @mousedown="searchFiles"
      >
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
          <!-- <Identicon :size="128" :theme="'polkadot'" :value="account" />Z -->
          <span class="username">{{
            $store.state.userInfo.account.address
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
        :height="120"
      />
      <CustomDropDown
        :items="$store.state.userInfo.accountOperator"
        :visible.sync="$store.state.userInfo.accountsVisible"
        :kind="'accounts'"
        :height="268"
      />
    </div>
    <el-dialog
      :visible.sync="$store.state.userInfo.noExtension"
      :close-on-click-modal="false"
      :show-close="false"
      width="830px"
    >
      <div slot="title" class="header">
        <div class="header-inner">
          <img src="../../assets/icons/sad.png" width="40px" /> Connection
          failed
        </div>
        <div>
          <img
            src="../../assets/icons/close-icon2.png"
            width="40px"
            @click="$store.state.userInfo.noExtension = false"
          />
        </div>
      </div>

      <div>
        <p>
          1. If you don't install Polkadot{js} Extension, install it from
          <a href="https://polkadot.js.org/extension/" target="_blank">
            here.</a
          >
        </p>
        <p>
          2. New to Data trading market? Follow
          <a href="https://polkadot.js.org/extension/" target="_blank"
            >this guide</a
          >
          to create your cess-hacknet chain wallet.
        </p>
        <p>
          3. If you have denied to connect to the cess-hacknet chain, please go
          to Manage Website Access in Polkadot{js} Extension to re-grant.
        </p>
      </div>
      <span slot="footer" class="dialog-footer"
        >Please re-login after troubleshooting the failure
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Identicon from "@polkadot/vue-identicon";
import { mapActions, mapGetters,mapMutations } from "vuex";
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
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(["isLogined"]),
  },
  watch: {},
  components: {
    CustomDropDown,
    // Identicon,
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
      this.setSearchKey(this.searchKey)
        this.$router.push({
          path: "/market",
          query: {
            keyword: this.searchKey,
          },
        }).catch((err)=>{
          console.log(err)
        });

    },
    handleDeleteClick() {},
    ...mapActions("userInfo", ["logout"]),
    ...mapMutations("userInfo", ["setSearchKey"])
  },

};
</script>

<style scoped lang="less">
.header-container {
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 2px solid #d7d7d7;
  padding: 0 20px;
  position: fixed;
  z-index: 2002;
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
      cursor: pointer;
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
      cursor: pointer;
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
    cursor: pointer;
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
  /deep/.el-dialog {
    padding: 40px 48px 53px 48px;
    border-radius: 14px;
    margin-top: 25vh !important;
    .header,
    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        margin-right: 6px;
        cursor: pointer;
      }
    }
  }
  /deep/.el-dialog__header {
    font-size: 30px;
    line-height: 44px;
    color: #606060;
    padding: 0 0;
  }
  /deep/.el-dialog__body {
    font-size: 18px;
    line-height: 26px;
    color: #606060;
    text-align: left;
    padding: 0 0;
    word-break: break-word;
    p {
      margin: 30px 0;
    }
    a {
      color: #5078fe;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  /deep/.el-dialog__footer {
    font-size: 18px;
    font-weight: bold;
    line-height: 26px;
    color: #fd6b6d;
    text-align: left !important;
    padding: 0 0;
  }
}
</style>
