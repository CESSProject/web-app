<template>
  <div class="layout-content">
    <div class="bread">
      <router-link to="market"> Market </router-link> <span> > </span> Data
      detail
    </div>
    <div class="datadetail-container">
      <div class="data-info-detail">
        <div class="file-header">
          <img src="../../assets/files/doc.png" />
          <div class="price">
            <span
              ><img
                src="../../assets/icons/download-icon.png"
                width="24px" /></span
            ><span>{{ detailData.estimateSpent }}</span
            >tCESS
            <div class="buy-btn" @click="open">buy</div>
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
            <div class="info-label">Download times:</div>
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
            <div class="info-content">{{ detailData.time | dealWithDate }}</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Data validity period:</div>
            <div class="info-content">
              {{ detailData.expireTime | dealWithDate }}
            </div>
          </div>
          <div class="info-detail">
            <div class="info-label">Proof of existence:</div>
            <div class="info-content">{{ detailData.classification }}</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Characteristic:</div>
            <div class="info-content">{{ detailData.classification }}</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Data creator:</div>
            <div class="info-content">{{ detailData.creator }}</div>
          </div>
          <div class="info-detail">
            <div class="info-label">E-mail:</div>
            <div class="info-content">{{ detailData.email }}</div>
          </div>
          <div class="info-detail">
            <div class="info-label">keyword:</div>
            <div class="info-content">{{ detailData.keywords }}</div>
          </div>
          <div class="overview">Overview: {{ detailData.overview }}</div>
        </div>
      </div>
      <div class="similar-data" v-if="sililar.length > 0">
        <p>Similar data</p>
        <div class="sililar-item" v-for="(i, index) in sililar" :key="index">
          <img src="../../assets/files/doc.png" width="52px" />
          <div>
            <div class="file-name">42352.doc</div>
            <div>Similarity: 23%</div>
            <div>Date owner: Qmy...Ydi</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="460px"
    >
      <span class="white">{{ content }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false"
          >Cancle</el-button
        >
        <el-button
          size="medium"
          type="primary"
          @click="handleClick"
          :loading="isLoading"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { types } from "@/utils/config";
import { parseTime, renderSize, fileType } from "@/utils/valid";
import {
  queryFileNeedPay,
  getFileInfo,
  decryptShareCode,
  fileDownload,
} from "@/api/api";
import { ApiPromise, WsProvider } from "@polkadot/api"; // Construct
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
export default {
  data() {
    return {
      isLoading: false,
      loading: null,
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
      },
      fileId: "",
      shareCode: "",
      sililar: [{}],
      dialogVisible: false,
      content: "",
      txHash: "",
      api: null,
      fid: "",
    };
  },
  components: {},
  mounted() {
    this.loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    if (this.$route.query.shareCode) {
      this.shareCode = this.$route.query.shareCode;
      this.queryByShareCode();
    }
    if (this.$route.query.fileId) {
      this.fileId = this.$route.query.fileId;
      this.queryFileInfo();
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
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
  },
  methods: {
    open() {
      console.log(this.fileId);
      this.dialogVisible = true;
      this.txHash = this.detailData.hash;
      this.content = "Download the file ?";
    },
    queryByShareCode() {
      let _this = this;
      decryptShareCode(this.shareCode).then((res) => {
        console.log("===", res);
        if (res.success) {
          _this.loading.close();
          _this.detailData = res;
        } else {
          _this.loading.close();
          if (res.errorCode === "100055") {
            _this.$message({
              type: "error",
              message: "",
            });
          }
        }
      });
    },
    getDetail() {
      const data = this.$route.query;
      console.log("data======", data);
      this.detailData = {
        name: data.name,
        type: fileType(data.name.substr(data.name.lastIndexOf("."))),
        size: renderSize(data.size),
        t: parseTime(data.t, "{y}-{m}-{d}"),
        cost: data.cost,
        hash: data.hash,
        fileId: Number(data.id),
        shareCode: data.code,
        chainAccount: data.chainAccount,
        overview: data.overview,
        classification: data.classification,
      };
    },
    downloadBtn() {
      this.title = this.$t("detail.d7");
      this.content = this.$t("detail.d8");
      this.dialogVisible = true;
    },
    handleClick() {
      let _this = this;
      this.dialogVisible = false;
      this.isLoading = false;
      queryFileNeedPay(this.fileId).then((res) => {
        console.log("查询下载文件是否需要支付===", res);
        if (res.needPay) {
          this.queryBanlance();
        } else {
          _this.dialogVisible = false;
          this.getFileDownload();
        }
      });
    },
    getFileDownload() {
      let _this = this;
      fileDownload({
        fileId: _this.fileId,
        txHash: _this.txHash,
      }).then((res) => {
        console.log("===", res);
        if (res.success) {
          axios
            .get(res.downloadUrl, {
              headers: {
                token: this.$store.state.userInfo.data.token,
              },
              responseType: "blob",
              // onDownloadProgress: (progressEvent) => {
              //   this.showProcess = true;
              //   let process =
              //     ((progressEvent.loaded / progressEvent.total) * 100) | 0;
              //   this.progress = process;
              //   console.log("progress===", this.showProcess, this.progress);
              // }
            })
            .then((result) => {
              console.log("===", result);
              // this.showProcess = false;
              if (result.status === 200) {
                let blob = new Blob([result.data]);
                let linkUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = res.downloadInfomationDO.name;
                link.href = linkUrl;
                link.click();
                link.remove();
              } else {
                this.status = 2;
                this.$message({
                  type: "error",
                  message: '',
                });
              }
            })
            .catch((error) => {
              console.log("===", error);
            });
        } else {
          if (this.isEn) {
            this.$message({
              type: "error",
              message: this.$t("downloadList.d6"),
            });
          } else {
            this.$message({
              type: "error",
              message: res.errorMsg,
            });
          }
        }
      });
    },
    queryFileInfo() {
      let _this = this;
      getFileInfo(this.fileId).then((res) => {
        console.log(res);
        _this.detailData = res.fileInformation;
        _this.fileIDHash = res.fileInformation.fid;
        _this.loading.close();
      });
    },

    async queryBanlance() {
      let _this = this;
      _this.loading = _this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // Create the instance
      const wsProvider = new WsProvider("wss://cess.today/rpc2-hacknet/ws/");

      this.api = await ApiPromise.create({ provider: wsProvider });
      console.log(_this.$store.state.userInfo.data.account);
      // this call fires up the authorization popup
      const extensions = await web3Enable("my cool dapp");
      if (extensions.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        return;
      }
      console.log("", extensions);

      // The actual address that we use
      const ADDR = this.$store.state.userInfo.data.myAddress;
      console.log("ADDR============", ADDR);
      const acct = await this.api.query.system.account(ADDR);
      let freeBalance = acct.data.free.toString(10);
      console.log("freeBalance", freeBalance);
      if (freeBalance > _this.detailData.estimateSpent) {
        _this.toBuy();
      } else {
        _this.loading.close();
        _this.$message({
          type: "error",
          message: "",
        });
      }
    },

    async toBuy() {
      console.log("tobuy", this.fileIDHash);
      let _this = this;
      let ADDR = this.$store.state.userInfo.data.myAddress;
      const transferExtrinsic = _this.api.tx.fileBank.buyfile(
        this.fileIDHash,
        ADDR
      );
      const injector = await web3FromSource(
        _this.$store.state.userInfo.data.account.meta.source
      );

      let txhash = transferExtrinsic
        .signAndSend(
          ADDR,
          { signer: injector.signer },
          ({ events = [], status }) => {
            console.log("status==========", status);
            console.log("events", events);
            if (status.isInBlock) {
              console.log(
                `Completed at block hash #${status.asInBlock.toString()}`
              );
              console.log(
                "===================",
                txhash,
                "txhash ???",
                transferExtrinsic
              );
              _this.loading.close();
              _this.getFileDownload();
            } else {
              console.log(`Current status: ${status.type}`);
            }
          }
        )
        .catch((error) => {
          console.log(":( transaction failed", error);
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
  padding: 36px 0px;
  text-align: left;
}
.bread {
  width: 1559px;
  margin: 0px auto;
  margin-bottom: 5px;
  color: #303030;
  font-size: 18px;
  a {
    text-decoration: none;
  }
}
.datadetail-container {
  position: relative;
  width: 1559px;
  margin: 0px auto;
  display: flex;
}

.similar-data {
  float: right;
}
.data-info-detail {
  flex: 1;
  min-height: 894px;
  background: #ffffff;
  border-radius: 14px;
  padding: 50px 131px 20px 142px;
  box-sizing: border-box;
  .file-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    .price {
      font-size: 24px;
      font-weight: bold;
      color: #5078fe;
      img {
        margin-right: 5px;
      }
      span:last-child {
        font-size: 18px;
        color: #303030;
      }
      .buy-btn {
        width: 235px;
        height: 48px;
        background: #5078fe;
        color: white;
        border-radius: 42px;
        font-size: 18px;
        font-weight: bold;
        line-height: 48px;
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
    }
    .info-detail {
      border-bottom: 1px solid #d7d7d7;
      height: 39px;
      line-height: 39px;
      display: flex;
      justify-content: space-between;
    }
    .overview {
      line-height: 22px;
      margin-top: 28px;
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
  }
  .sililar-item {
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    color: #606060;
    line-height: 20px;
    padding: 24px 0px 33px 0px;
    border-bottom: 1px solid #d7d7d7;
    .file-name {
      font-size: 18px;
      line-height: 24px;
    }
  }
  .sililar-item:last-child {
    border-bottom: none;
  }
}
</style>
