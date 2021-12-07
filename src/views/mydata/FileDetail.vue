<template>
  <div class="layout-content" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="bread" v-if="!expiredFlag">
      <router-link to="market" v-show="fromPath === '/market'">
        Market >
      </router-link>
      <router-link to="myCloud" v-show="fromPath === '/myCloud'">
        My data >
      </router-link>
      <span> </span> Data detail
    </div>
    <div class="datadetail-container">
      <div class="data-info-detail" v-if="!expiredFlag">
        <div class="file-header">
          <img :src="fileTypeImg" width="122px" />
          <div class="price">
            <div class="price-top">
              <span>
                <img src="../../assets/icons/download-icon.png" width="24px"
              /></span>
              <span>{{ detailData.estimateSpent }}</span>
              <span class="unit">TCESS</span>
            </div>
            <el-button type="primary" class="buy-btn" @click="handleClick">
              {{ needPay ? "buy" : "download" }}</el-button
            >
          </div>
        </div>
        <div class="file-info">
          <div class="file-name">{{ detailData.name }}</div>
          <div class="info-detail">
            <div class="info-label">Classification:</div>
            <div class="info-content">
              {{ detailData.classification | typeFilter }}
            </div>
          </div>
          <div class="info-detail">
            <div class="info-label">Sales:</div>
            <div class="info-content">{{ detailData.downloadTimes }}</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Data ID:</div>
            <div class="info-content">{{ detailData.fid }}</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Data owner:</div>
            <div class="info-content">{{ detailData.chainAccount }}</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Data size:</div>
            <div class="info-content">{{ detailData.size | sizeFilter }}</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Upload time:</div>
            <div class="info-content">
              {{ detailData.createTime | dealWithDate }}
            </div>
          </div>
          <div class="info-detail">
            <div class="info-label">Data validity period:</div>
            <div class="info-content">
              {{ detailData.expireTime | dealWithDate }}
            </div>
          </div>
          <div class="info-detail">
            <div class="info-label">Proof of existence:</div>
            <div class="info-content">0x{{ detailData.hash }}</div>
          </div>
          <div class="info-detail" v-if="detailData.simhash !== '-1'">
            <div class="info-label">Characteristic:</div>
            <div class="info-content">
              {{ detailData.simhash }}
            </div>
          </div>
          <div class="info-detail" v-if="detailData.creator !== ''">
            <div class="info-label">Data creator:</div>
            <div class="info-content">{{ detailData.creator }}</div>
          </div>
          <div class="info-detail" v-if="detailData.email !== ''">
            <div class="info-label">E-mail:</div>
            <div class="info-content">{{ detailData.email }}</div>
          </div>
          <div class="info-detail" v-if="detailData.keywords !== ''">
            <div class="info-label">keyword:</div>
            <div class="info-content keywords">{{ detailData.keywords }}</div>
          </div>
          <div class="overview" v-if="detailData.overview !== ''">
            Overview: {{ detailData.overview }}
          </div>
        </div>
      </div>
      <div class="similar-data" v-if="sililar.length > 0 && !expiredFlag">
        <p>Similar data</p>
        <div
          class="sililar-item"
          v-for="(i, index) in sililar"
          :key="index"
          @click="viewFileDetail(i)"
        >
          <img :src="i.fileImg" width="52px" />
          <div>
            <div class="file-name">{{ i.name }}</div>
            <div>Similarity: {{ i.similarity | similarityFilter }}</div>
            <div class="owner">Date owner: {{ i.chainAccount }}</div>
          </div>
        </div>
      </div>
      <div class="datadetail-empty" v-if="expiredFlag">
        <img src="../../assets/empty.png" width="208px" />
        <p>The sharing code has expired or the file does not exist</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { types } from "@/utils/config";
import { parseTime, renderSize, fileType, similarValue } from "@/utils/valid";
import { mapGetters } from "vuex";
import {
  queryFileNeedPay,
  getFileInfo,
  decryptShareCode,
  fileDownload,
  getSimilarFiles,
} from "@/api/api";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
export default {
  data() {
    return {
      isLoading: false,
      loading: null,
      loading2: null,
      fullscreenLoading: true,
      detailData: {
        name: "",
        type: "",
        size: 0,
        t: 0,
        cost: 0,
        hash: "",
        chainAccount: "",
        keyword: "",
        overview: "",
        email: "",
        creator: "",
        classification: "1",
        time: "",
        fid: "",
      },
      fileTypeImg: "",
      fileId: "",
      shareCode: "",
      sililar: [],
      dialogVisible: false,
      content: "",
      txHash: "",
      downloadBlockHash: "",
      api: null,
      fid: "",
      needPay: true,
      fromPath: "",
      timer: null,
      downloading: false,
      buyFlag: null,
      expiredFlag: false,
    };
  },
  watch: {
    async isLogined() {
      let _this = this;
      console.log("isLogined =============");
      this.fullscreenLoading = true;
      await _this.queryFileInfo(this.fileId, this.fid);
      if (_this.buyFlag) {
        if (_this.needPay) {
          await _this.queryBanlance();
        } else {
          this.fullscreenLoading = true;
          await _this.getFileDownload();
        }
      }

      await _this.checkNeedPay();
    },
  },
  computed: {
    ...mapGetters(["isLogined"]),
  },
  async mounted() {

    if (this.$route.query.shareCode) {
      this.shareCode = this.$route.query.shareCode;
      this.queryByShareCode();
    }
    if (this.$route.query.fileId || this.$route.query.fid) {
      if (this.$route.query.fileId) this.fileId = this.$route.query.fileId;
      if (this.$route.query.fid) this.fid = this.$route.query.fid;
      console.log("32423432423", this.fileId, this.fid);
      await this.queryFileInfo(this.fileId, this.fid);
      await this.querySimilarFiles();
      await this.checkNeedPay();
      this.fullscreenLoading = false;
    }
  },
  filters: {
    typeFilter(value) {
      let options = types;
      if (options[Number(value - 1)].label)
        return options[Number(value - 1)].label;
    },
    sizeFilter(value) {
      return renderSize(value);
    },
    dealWithDate(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    similarityFilter(value) {
      return similarValue(value);
    },
    ToHex(str) {
      if (str) {
        if (str === "") return "";
        if (str === "0") return "Checking";
        let hexCharCode = [];
        hexCharCode.push("0x");
        for (let i = 0; i < str.length; i++) {
          hexCharCode.push(str.charCodeAt(i).toString(16));
        }
        return hexCharCode.join("");
      }
    },
  },
  beforeRouteEnter: (to, from, next) => {
    console.log(from.path);

    next((vm) => {
      vm.fromPath = from.path;
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    viewFileDetail(value) {
      this.$router.push({
        path: "/fileDetail",
        query: {
          fileId: value.fileId,
        },
      });
    },
    authorization() {
      this.$store.dispatch("userInfo/authorization");
    },
    queryByShareCode() {
      let _this = this;
      this.fullscreenLoading = true;
      decryptShareCode(this.shareCode).then((res) => {
        console.log("===", res);
        if (res.success) {
          this.fullscreenLoading = false;
          _this.detailData = res.fileInformation;
          _this.fileId = res.fileInformation.fileId;
          _this.fid = res.fileInformation.fid;
          _this.fileTypeImg = fileType(res.fileInformation.suffix);
          _this.querySimilarFiles();
          _this.checkNeedPay();
        } else {
          _this.expiredFlag = true;
          this.fullscreenLoading = false;
        }
      });
    },
    handleClick() {
      let _this = this;
      this.buyFlag = true;
      this.fullscreenLoading = true;
      if (!this.isLogined) {
        this.authorization();
        return;
      }
      if (_this.needPay) {
        this.queryBanlance();
      } else {
        this.getFileDownload();
      }
    },
    checkNeedPay() {
      queryFileNeedPay(this.fileId).then((res) => {
        if (res.success) {
          this.needPay = res.needPay;
        }
      });
    },
    // Old download way

    // getFileDownload() {
    //   let _this = this;
    //   fileDownload({
    //     fileId: _this.fileId,
    //     txHash: _this.downloadBlockHash,
    //   }).then((res) => {
    //     console.log("===", res);
    //     if (res.success) {
    //       axios
    //         .get(res.downloadUrl, {
    //           headers: {
    //             token: this.$store.state.userInfo.data.token,
    //           },
    //           // responseType: "blob",
    //         })
    //         .then(async (result) => {
    //           console.log("===", result);
    //           if (result.data.code === 0) {
    //             const link = document.createElement("a");
    //             link.download = res.downloadInfomationDO.name;
    //             link.href = result.data.data;
    //             link.click();
    //             link.remove();
    //             _this.$message({
    //               type: "success",
    //               message: "Download succeed",
    //             });
    //             _this.buyFlag = false;
    //             await _this.queryFileInfo(this.fileId, this.fid);
    //             await _this.checkNeedPay();
    //             _this.fullscreenLoading = false;
    //           } else {
    //             this.fullscreenLoading = false;
    //             this.$message({
    //               type: "error",
    //               message: "Download failed",
    //             });
    //           }
    //         })
    //         .catch((error) => {
    //           this.fullscreenLoading = false;
    //           console.log("===", error);
    //           this.$message({
    //             type: "error",
    //             message: "Download failed",
    //           });
    //         });
    //     } else {
    //       this.fullscreenLoading = false;
    //       this.$message({
    //         type: "error",
    //         message: "The file resource is expired!",
    //       });
    //     }
    //   });
    // },
    getFileDownload() {
      let _this = this;
      fileDownload({
        fileId: _this.fileId,
        txHash: _this.downloadBlockHash,
      }).then((res) => {
        console.log("===", res);
        if (res.success) {
          let url = 'http://139.224.19.104:80/download'
          let index = res.downloadUrl.indexOf('token') +6;
          let hash = res.downloadUrl.slice(res.downloadUrl.indexOf('download')+9,res.downloadUrl.indexOf('?'))
          let token = res.downloadUrl.slice(index,res.downloadUrl.length);
          console.log("url", url);
          console.log("token",token,);
          console.log("hash", hash);
          let data = {
            hash: hash,
            token:token
          };
          axios
            .post(url,data)
            .then(async (result) => {
              console.log("===", result);
              if (result.data.code === 0) {
                const link = document.createElement("a");
                link.download = res.downloadInfomationDO.name;
                link.href = result.data.data;
                link.click();
                link.remove();
                _this.$message({
                  type: "success",
                  message: "Download succeed",
                });
                _this.buyFlag = false;
                await _this.queryFileInfo(this.fileId, this.fid);
                await _this.checkNeedPay();
                _this.fullscreenLoading = false;
              } else {
                this.fullscreenLoading = false;
                this.$message({
                  type: "error",
                  message: "Download failed",
                });
              }
            })
            .catch((error) => {
              this.fullscreenLoading = false;
              console.log("===", error);
              this.$message({
                type: "error",
                message: "Download failed",
              });
            });
        } else {
          this.fullscreenLoading = false;
          this.$message({
            type: "error",
            message: "The file resource is expired!",
          });
        }
      });
    },
    queryFileInfo(fileId, fid) {
      let _this = this;
      this.fullscreenLoading = true;
      getFileInfo(fileId, fid).then((res) => {
        console.log(res);
        _this.detailData = res.fileInformation;
        _this.fid = res.fileInformation.fid;
        _this.fileId = res.fileInformation.fileId;
        _this.fileTypeImg = fileType(res.fileInformation.suffix);
      });
    },
    querySimilarFiles() {
      getSimilarFiles(this.fileId).then((res) => {
        console.log("querySimilarFiles", res);
        if(res.success) {
        this.sililar = res.fileList;
        this.sililar.forEach((item) => {
          item.fileImg = fileType(item.suffix);
        });
        }

      });
    },
    async queryBanlance() {
      let _this = this;
      // Create the instance
      const wsProvider = new WsProvider("ws://106.15.44.155:9947/");
      this.api = await ApiPromise.create({ provider: wsProvider });
      console.log(_this.$store.state.userInfo.data.account);
      // this call fires up the authorization popup
      const extensions = await web3Enable("Data trading market");
      if (extensions.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        return;
      }
      // console.log("extensions", extensions);

      // The actual address that we use
      const ADDR = this.$store.state.userInfo.data.myAddress;
      console.log("ADDR============", ADDR);
      const acct = await this.api.query.system.account(ADDR);
      let free = acct.data.free.toString(10);
      let freeBalance = (Number(free) / 1000000000000).toFixed(4);
      console.log("freeBalance", freeBalance);
      if (freeBalance > _this.detailData.estimateSpent) {
        _this.toBuy();
      } else {
        this.fullscreenLoading = false;
        _this.$message({
          type: "error",
          message: "Insufficient tokens",
        });
      }
    },

    async toBuy() {
      let _this = this;
      let ADDR = this.$store.state.userInfo.data.myAddress;
      console.log("tobuy", this.fid, ADDR);

      const transferExtrinsic = _this.api.tx.fileBank.buyfile(this.fid, ADDR);
      const injector = await web3FromSource(
        _this.$store.state.userInfo.data.account.meta.source
      );

      let txhash = transferExtrinsic
        .signAndSend(
          ADDR,
          { signer: injector.signer },
          ({ events = [], status }) => {
            console.log("status==========", status, events);
            console.log("events", events);
            if (status.isInBlock) {
              console.log(
                `Completed at block hash #${status.asInBlock.toString()}`
              );
              _this.downloadBlockHash = status.asInBlock.toString();
              _this.getFileDownload();
            } else {
              console.log(`Current status: ${status.type}`);
              if (status.type === "Invalid") {
                _this.fullscreenLoading = false;
                _this.$message({
                  type: "error",
                  message: "The file resource is expired!",
                });
              }
            }
          }
        )
        .catch((error) => {
          console.log(":( transaction failed", error);
          this.fullscreenLoading = false;
        });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang="less">
.layout-content {
  padding: 36px 50px;
  text-align: left;
  min-height: 800px;

  .bread {
    max-width: 1559px;
    margin: 0px auto;
    margin-bottom: 5px;
    color: #303030;
    font-size: 18px;
    a {
      color: #303030;
    }
  }
  .datadetail-container {
    position: relative;
    max-width: 1559px;
    margin: 0px auto;
    display: flex;
  }

  .similar-data {
    float: right;
  }
  .datadetail-empty {
    background: #ffffff;
    border-radius: 14px;
    text-align: center;
    height: 800px !important;
    box-sizing: border-box;
    padding-top: 130px;
    width: 100%;
    p {
      font-size: 28px;
      line-height: 50px;
      color: #737373;
    }
  }
  .data-info-detail {
    flex: 1;
    min-height: 894px;
    background: #ffffff;
    border-radius: 14px;
    padding: 50px 131px 20px 142px;
    box-sizing: border-box;
    width: 1191px;
    .file-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      .price {
        font-size: 24px;
        color: #005eff;
        padding-top: 28px;
        font-family: "Open-Sans-Bold";
        line-height: 1;
        .price-top {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        img {
          margin-right: 10px;
        }
        .unit {
          font-size: 18px;
          color: #303030;
          font-family: "Open-Sans";
          margin-left: 8px;
        }
        .buy-btn {
          width: 235px;
          height: 48px;
          background: #005eff;
          color: white;
          border-radius: 42px;
          font-size: 18px;
          font-weight: bold;
          border: none;
          text-align: center;
          color: #ffffff;
          margin-top: 22px;
          cursor: pointer;
        }
      }
    }
    .file-info {
      font-size: 14px;
      color: #363636;
      .file-name {
        font-size: 24px;
        font-weight: bold;
        line-height: 40px;
        color: #363636;
        word-break: break-all;
        white-space: pre;
      }
      .info-label {
        min-width: 150px;
      }
      .info-detail {
        border-bottom: 1px solid #d7d7d7;
        line-height: 39px;
        display: flex;
        justify-content: space-between;
        .info-content {
          word-break: break-word;
        }
        .keywords {
          line-height: 22px;
        }
      }
      .overview {
        line-height: 22px;
        margin-top: 28px;
        word-break: break-all;
      }
    }
  }
  .similar-data {
    width: 361px;
    height: 718px;
    background: #ffffff;
    border-radius: 14px;
    margin-left: 7px;
    padding: 47px 30px;
    box-sizing: border-box;
    p {
      font-size: 24px;
      font-weight: bold;
      color: #363636;
      margin: 0 0;
    }
    img {
      margin-right: 16px;
      height: max-content;
    }
    .sililar-item {
      display: flex;
      justify-content: flex-start;
      font-size: 14px;
      color: #363636;
      line-height: 20px;
      padding: 24px 0px 33px 0px;
      border-bottom: 1px solid #d7d7d7;
      cursor: pointer;
      .file-name {
        font-size: 18px;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        word-break: break-all;
        -webkit-line-clamp: 1;
      }
      .owner {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        word-break: break-all;
        -webkit-line-clamp: 1;
      }
    }
    .sililar-item:last-child {
      border-bottom: none;
    }
  }
}
</style>
