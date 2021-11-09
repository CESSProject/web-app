<template>
  <div class="header-container">
    <div class="logo">
      <img src="../../assets/header-logo.png" height="55px" />
    </div>
    <div class="title">Matket</div>
    <div class="search-bar">
      <el-input
        v-model="searchKey"
        placeholder=""
        @focus="showSearchIcon = false"
        @blur="showSearchIcon = true"
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
      <div class="search-icon2" v-show="!showSearchIcon">
        <img src="../../assets/icons/search2.png" width="22px" />
      </div>
    </div>
    <div class="login-box nav-menu">
      <div class="login-btn" v-if="!isLogined" @click.stop="loginTest()">
        <img src="../../assets/icons/logo-icon.png" width="15px" />
        Log in
      </div>

      <div class="user-center" v-else style="min-width: 60px">
        <div
          class="language-selector"
          @click="userInfoVisible = !userInfoVisible"
        >
          <img :src="imgUrl" alt="" class="user-avatar" :onerror="errorImg" />
          <!-- <Identicon :size="128" :theme="'polkadot'" :value="account" /> -->
          <span class="username">{{
            $store.state.userInfo.data.myAddress
          }}</span>
          <!-- <img src="../assets/icon_xia.png" class="arrow" /> -->
        </div>
        <!-- <CustomDropDown :items="userOperator" :visible.sync="userInfoVisible" /> -->
        <CustomDropDown :items="accountOperator" :visible.sync="userInfoVisible" />

      </div>
    </div>
  </div>
</template>

<script>
import Identicon from "@polkadot/vue-identicon";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3ListRpcProviders,
  web3UseRpcProvider,
  web3AccountsSubscribe,
  web3FromSource,
} from "@polkadot/extension-dapp";
// Import
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api"; // Construct
import { stringToHex } from "@polkadot/util";
import { mapActions, mapGetters } from "vuex";
import CustomDropDown from "../../components/customDropDown.vue";
export default {
  data() {
    return {
      userInfoVisible: false,
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
      accountOperator: [
        {
          icon: require("../../assets/icons/default-avater.png"),
          text: "5454353454",
          callback: (item) => {
            console.log(item);
          },
        },
      ],
      account: null,
      searchKey: "",
      showSearchIcon: true,
    };
  },
  computed: {
    ...mapGetters(["isLogined"]),
  },
  components: {
    CustomDropDown,
    Identicon,
  },
  mounted() {
    this.keys();
  },
  methods: {
    focusSearch() {
      this.$refs.searchInput.focus();
      this.showSearchIcon = false;
    },
    searchBar() {
      this.showSearchIcon = false;
    },
    async loginTest() {
      const extensions = await web3Enable("my cool dapp");
      if (extensions.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        return;
      }
      // returns an array of { address, meta: { name, source } }
      // meta.source contains the name of the extension that provides this account  meta.source 包含提供此帐户的扩展名
      let allAccounts = await web3Accounts();
      //   console.log("allAccounts========", allAccounts);
      const account = allAccounts[0];
      //   console.log("account", account);
      this.account = account;

      const injector = await web3FromSource(account.meta.source);
      console.log(
        "we can use web3FromSource which will return an InjectedExtension type",
        injector
      );

      const signRaw = injector?.signer?.signRaw;
      console.log("signRaw=============", signRaw);
      if (signRaw) {
        // after making sure that signRaw is defined
        // we can use it to sign our message
        console.log(
          "!!!!!!!!!!",
          account.address,
          stringToHex(account.address)
        );
        await signRaw({
          address: account.address,
          data: stringToHex(account.address),
          type: "bytes",
        })
          .then((res) => {
            console.log(res);
            this.userInfoVisible = true;
            let userInfo = {
              myAddress: account.address,
            };
            this.$store.dispatch("userInfo/saveInfo", userInfo);
          })
          .catch((err) => {
            console.log(err);
          });
        // console.log(signature)
      }
    },

    login() {
      this.userInfoVisible = true;
      this.isLogined = true;
      this.$store.state.userInfo.data.myAddress =
        "0xdehfefhiasuyfiabewfkzhewfjb";
    },
    async keys() {},
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
  .logo {
    margin-right: 55px;
  }
  .title {
    font-size: 24px;
    font-family: "Alegreya Sans SC";
    font-weight: 800;
    line-height: 44px;
    color: #5078fe;
    position: relative;
  }
  .title::after {
    position: absolute;
    content: "";
    width: 86px;
    height: 2px;
    background: #5078fe;
    bottom: -13px;
    left: 0px;
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
      font-family: "Roboto";
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
      font-family: "Roboto";
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
    cursor: pointer;
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
  }
}
</style>
