import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";

import { stringToHex } from "@polkadot/util";
import { Message } from 'element-ui';
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
    userInfoVisible:false,
    noExtension:false,
    searchKey:'',
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
      // state.userInfoVisible = true;
    },
    clearUserInfo(state) {
      state.data = {}
      state.accountList = []
      state.accountOperator = []
      state.isLogined = false
      state.token = ''
    },
    setSearchKey(state, searchKey) {
      state.searchKey = searchKey
    },
  },
  actions: {
    async authorization({
      commit,
      state
    }) {

        const extensions = await web3Enable("Data tranding market");
        if (extensions.length === 0) {
          state.noExtension = true
          return;
        }
        let allAccounts = await web3Accounts();
        console.log("allAccounts========", allAccounts);
        state.accountList = allAccounts;
        if(allAccounts.length ==0){
          Message.error('Please create cess-hacknet chain account.');
        }else {
  
          if(state.accountOperator.length==0){
            state.accountList.forEach((item) => {
              console.log("item==========",item)
              let obj = {
                icon: require("../../assets/icons/default-avater.png"),
                meta: item.meta,
                address: item.address,
                callback: async (item) => {
                  console.log(item);
                  state.account = item;
                  const injector = await web3FromSource(item.meta.source);
                  console.log(
                    "we can use web3FromSource which will return an InjectedExtension type",
                    injector
                  );
                  const signRaw = injector?.signer?.signRaw;
                  console.log("signRaw=============", signRaw);
                  if (signRaw) {
                    await signRaw({
                      address: item.address,
                      data: stringToHex(item.address),
                      type: "bytes",
                    })
                      .then((res) => {
                        console.log(res, res.signature.slice(2));
                        let data = {
                          myAddress: item.address,
                          signature: res.signature.slice(2),
                          account: item,
                        };
                        commit('setUserInfo',data)
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                },
              };
              state.accountOperator.push(obj);
            });
          }
          state.accountsVisible = true;
          state.userInfoVisible = false;
  
        }
      
    },
    saveInfo({
      commit
    }, result) {
      console.log('result===', result)
      commit('setUserInfo', result)
    },
    logout({
      commit
    }) {
      commit('clearUserInfo')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('publicUsersInfo')
      location.href = '/data'
    }
  }
}
export default userInfo