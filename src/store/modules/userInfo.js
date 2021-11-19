import {
  getUserInfo,
} from '../../api/api'
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
const userInfo = {
  namespaced: true,
  state: {
    data: {},
    isLogined: false,
    isCollapse: false,
    isTopNav: false,
    isSidebar: false,
    loading: false,
    fileId: null, // file id
    txHash: '', // transactions hash
    token: '',
    accountList:[],
    accountOperator:[],
    account:null,
    accountsVisible:false,
    userInfoVisible:false
  },
  getters: {
    userInfo: state => {
      return state.data
    }
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.data = userInfo
      state.isLogined = true
      state.userInfoVisible = true;
    },
    clearUserInfo(state) {
      state.data = {}
      state.accountList = []
      state.accountOperator = []
      state.isLogined = false
      state.token = ''
    },
    modifyUserInfo(state, newInfo) {
      state.data = Object.assign(state.data, newInfo)
    },
    async login(state, value) {
      const injector = await web3FromSource(state.account.meta.source);
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
          state.account.address,
          stringToHex(state.account.address)
        );
        await signRaw({
          address: state.account.address,
          data: stringToHex(state.account.address),
          type: "bytes",
        })
          .then((res) => {
            debugger
            console.log(res, res.signature.slice(2));
            let userInfo = {
              myAddress: state.account.address,
              signature: res.signature.slice(2),
              account: state.account,
            };
            state.data = userInfo;
            state.isLogined = true;

          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  actions: {
    async authorization({
      commit,
      state
    }) {
      const extensions = await web3Enable("my cool dapp");
      if (extensions.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        this.$message.error(
          "No Polkawallet was found."
        );
        return;
      }
      let allAccounts = await web3Accounts();
      console.log("allAccounts========", allAccounts);
      state.accountList = allAccounts;
      state.accountList.forEach((item) => {
        let obj = {
          icon: require("../../assets/icons/default-avater.png"),
          meta: item.meta,
          address: item.address,
          callback: (item) => {
            console.log(item);
            state.account = item;
            commit('login',item)
          },
        };
        state.accountOperator.push(obj);
      });
      state.accountsVisible = true;
    },
    saveInfo({
      commit
    }, result) {
      console.log('result===', result)
      commit('setUserInfo', result)
    },
    logout({
      commit,
      state
    }) {
      commit('clearUserInfo')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('publicUsersInfo')
      location.href = '/'
    }
  }
}
export default userInfo