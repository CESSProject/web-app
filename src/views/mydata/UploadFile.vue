<template>
  <div class="layout-content">
    <div class="bread">
      <router-link to="/myCloud"> My data </router-link> <span> > </span> Upload
    </div>
    <div class="uploadFile-container">
      <div class="upload-img">
        <img src="../../assets/upload1.png" width="99px" />
        <img src="../../assets/upload2.png" width="195px" />
      </div>
      <div class="content">
        <el-form
          :model="ruleFormFile"
          :rules="rulesForm"
          ref="ruleFormFile"
          label-width="380px"
          class="demo-ruleFormFile uploadruleFormFile"
        >
          <el-form-item prop="name">
            <span slot="label"> Select file： </span>
            <div class="flex">
              <el-input
                v-model="ruleFormFile.name"
                readonly
                placeholder="Select file"
                maxlength="200"
              ></el-input>

              <div class="upload-btn">
                <img src="../../assets/icons/select.png" width="39px" />
                <input
                  type="file"
                  class="file-upload"
                  @change="localFileUpload"
                  ref="fileInput"
                />
              </div>
              <span
                v-show="confirmDisabled && ruleFormFile.name !== ''"
                class="caculate-tips"
                >Reading data...</span
              >
            </div>
          </el-form-item>
          <el-form-item prop="classification">
            <span slot="label"> Classification :</span>
            <el-select
              v-model="ruleFormFile.classification"
              placeholder="Please select file classification"
              @change="$forceUpdate()"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in options"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="not-required">File creator：</span>
            <el-input
              type="text"
              v-model="ruleFormFile.fileCreator"
              maxlength="50"
              placeholder="Please enter the file creator"
              class="overview"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <span slot="label" class="not-required">E-mail：</span>
            <el-input
              type="text"
              v-model="ruleFormFile.email"
              maxlength="50"
              placeholder="Please enter E-mail"
              class="overview"
            ></el-input>
          </el-form-item>
          <el-form-item prop="keywords">
            <span slot="label" class="not-required">Keywords：</span>
            <el-input
              type="text"
              v-model="ruleFormFile.keywords"
              maxlength="200"
              placeholder="Enter keywords, separated by commas"
              class="overview"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="not-required">Overview：</span>
            <el-input
              type="textarea"
              :rows="4"
              v-model="ruleFormFile.overview"
              placeholder="Please enter an overview"
              class="overview"
              maxlength="1000"
            ></el-input>
          </el-form-item>
          <el-form-item prop="visibility">
            <span slot="label"> Is the file public：</span>
            <el-radio-group v-model="ruleFormFile.visibility">
              <el-radio :label="1">Yes</el-radio>
              <el-radio :label="0">No</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="expireTime" class="expire-time">
            <span slot="label" style="line-height: 20px">
              Storage validity period from today to ：</span
            >
            <el-date-picker
              class="w100"
              v-model="ruleFormFile.expireTime"
              type="date"
              :placeholder="'Select Date'"
              :picker-options="expireTimeOption"
              :clearable="false"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="estimateSpent" class="pt">
            <span slot="label"> Download price/MB ：</span>
            <el-input
              v-model="ruleFormFile.estimateSpent"
              placeholder="Please enter download price"
              :maxlength="15"
              @input="oninput"
            ></el-input>
            <span class="unit">tCESS</span>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="not-required">
              Revenue per download：</span
            >
            <span class="cost"
              >{{ (ruleFormFile.estimateSpent * 0.8).toFixed(4) }} tCESS</span
            >
          </el-form-item>
          <el-form-item>
            <span slot="label" class="not-required"> Storage cost：</span>
            <span class="cost">{{ storageCost }} tCESS </span>
          </el-form-item>
        </el-form>
        <div class="bottom-btns">
          <el-button size="medium" @click="cancleUpload" class="cancle-btn"
            >Cancle</el-button
          >
          <el-button
            class="cancle-btn"
            :class="confirmDisabled ? '' : 'confirm-btn'"
            size="medium"
            type="primary"
            :disabled="confirmDisabled"
            @click="submitForm('ruleFormFile')"
            >Confirm
          </el-button>
        </div>
      </div>
    </div>
    <div class="drawer-dialog" v-if="isDrawer">
      <div class="drawer-main">
        <div class="drawer-left">
          <span class="name">{{ getFileInfo.name }}</span>
          <el-progress
            :percentage="progress"
            color="#4A71FE"
            v-if="showProcess"
          ></el-progress>
          <span
            class="status"
            :class="{ success: isSuccess }"
            v-if="showProcess"
            ><span>{{ isSuccess ? "success" : "" }}</span>
          </span>
          <span class="status retry" v-if="isFailed" @click="uploadtoDataBase">
            <span>Fail！</span> Re-Upload</span
          >
        </div>
        <div class="close-icon" @click="onClose"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { types } from "@/utils/config";
import * as SparkMD5 from "spark-md5";
import { getSHA256 } from "../../utils/docHashFun";
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { ApiPromise, WsProvider } from "@polkadot/api"; // Construct
import { addFileData } from "@/api/api";
export default {
  data() {
    return {
      loading: null,
      reuploadFileId: null,
      uploadType: 0,
      uploadUrl: "",
      isDrawer: false,
      showProcess: false,
      md5: "",
      suffix: "",
      size: "",
      isSuccess: false,
      isError: false,
      isFailed: false,
      progress: 0,
      fileHash: "",
      fileIDHash: "",
      fileBlockHash:'',
      fileInfo: {},
      getFileInfo: {},
      ruleFormFile: {
        name: "",
        size: "",
        estimateSpent: 1,
        expireTime: null,
        visibility: 1,
        path: "",
        imageUrl: "",
        suffix: "",
        limitTime: "",
        priceMb: 0,
        hash: "",
        parentId: 0,
        filePath: "",
        classification: "",
        fileCreator: "",
        email: "",
        keywords: "",
        overview: "",
        fileName: "",
      },
      defaultDate: null,
      reloadInfo: {
        parentId: 0,
        filePath: "",
        fileName: "",
        md5: "",
      },
      confirmDisabled: true,
      rulesForm: {
        name: [{ required: true, message: "Upload file", trigger: "change" }],
        visibility: [
          { required: true, message: "Is the file public", trigger: "change" },
        ],
        expireTime: [
          {
            required: true,
            message: "Storage validity period from today to",
            trigger: "change",
          },
        ],
        estimateSpent: [
          {
            required: true,
            message: "Please enter download price",
            trigger: "blur",
          },
          {
            pattern: /^\d{1,10}(\.\d{1,4})?$/,
            message: "Download price range from 0 to 9999999999.9999！",
            trigger: "blur",
          },
        ],
        classification: [
          {
            required: true,
            message: "Please select file classification",
            trigger: "change",
          },
        ],
        keywords: [
          {
            required: false,
            validator: this.validateKeywords,
            trigger: "change",
          },
        ],
        email: [
          {
            required: false,
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "Please enter the correct e-mail address",
            trigger: "change",
          },
        ],
      },
      expireTimeOption: {
        disabledDate(date) {
          let date1 = new Date();
          let date2 = new Date(date1);
          date2.setDate(date1.getDate() + 179);
          date2.setHours(0, 0, 0, 0);
          let minYear = date2.getFullYear() + 1;
          return (
            date.getTime() < date2.getTime() ||
            date.getTime() > new Date(JSON.stringify(minYear))
          );
        },
      },
      options: types,
      source: {},
      api: null,
    };
  },
  computed: {
    storageCost() {
      return 0;
    },
  },
  async mounted() {
    let date1 = new Date();
    this.defaultDate = new Date(date1);
    this.defaultDate.setDate(this.defaultDate.getDate() + 179);
    this.defaultDate.setHours(0, 0, 0, 0);
    this.ruleFormFile.expireTime = this.defaultDate;
  },
  methods: {
    validateKeywords(rule, value, callback) {
      let count = 0;
      let tmp = value;
      while (tmp.indexOf(",") != -1) {
        tmp = tmp.replace(",", "");
        count++;
      }
      console.log("++++++++++++++++", count);
      if (count > 4) {
        callback(
          new Error("Enter keywords, separated by commas, up to 5 keywords")
        );
      } else {
        callback();
      }
      return;
    },
    onClose() {
      this.source.cancel("");
      this.isDrawer = false;
      this.showProcess = false;
      this.progress = 0;
      this.fileInfo = {};
    },
    oninput(e) {
      console.log(e, typeof e, e.length);
      e = e.replace(/^(-)*(\d{1,10})\.(\d\d\d\d).*$/, "$1$2.$3");
      this.ruleFormFile.estimateSpent = e;
    },
    localFileUpload(file) {
      this.confirmDisabled = true;
      let data = file.target.files[0];
      getSHA256(data).then((res) => {
        console.log("hash", res);
        this.fileHash = "0x" + res;
      });
      const isAbove0 = data.size > 0;
      if (!isAbove0) {
        this.$message.error(
          "You have selected an empty file, please select again!"
        );
        return false;
      }
      if (this.uploadType === 0) {
        this.ruleFormFile.name = data.name;
        this.source = axios.CancelToken.source();
        console.log("this.source===== ", this.source.token, data);
        this.fileInfo = data;
        this.size = data.size;
        this.suffix = data.name.substr(data.name.lastIndexOf("."));
        this.$refs.fileInput.value = "";
        this.calculate(data, (md5) => {
          this.md5 = md5;
          this.confirmDisabled = false;
        });
      } else {
        this.reloadInfo.md5 = "";
        this.confirmDisabled = true;
        let data = file.target.files[0];
        this.source = axios.CancelToken.source();
        console.log("this.source===== ", this.source.token, data);
        this.fileInfo = data;
        this.reloadInfo.fileName = data.name;
        this.size = data.size;
        this.suffix = data.name.substr(data.name.lastIndexOf("."));
        this.calculate(data, (md5) => {
          this.reloadInfo.md5 = md5;
        });
        // this.$refs.inputFile.value = "";
      }
    },
    calculate(file, callBack) {
      let fileReader = new FileReader();
      let blobSlice =
        File.prototype.mozSlice ||
        File.prototype.webkitSlice ||
        File.prototype.slice;
      let chunkSize = 2097152;
      // read in chunks of 2MB
      let chunks = Math.ceil(file.size / chunkSize);
      let currentChunk = 0;
      let spark = new SparkMD5();

      fileReader.onload = (e) => {
        spark.appendBinary(e.target.result); // append binary string
        currentChunk++;

        if (currentChunk < chunks) {
          this.loadNext(file, currentChunk, chunkSize, fileReader, blobSlice);
        } else {
          callBack(spark.end());
        }
      };

      this.loadNext(file, currentChunk, chunkSize, fileReader, blobSlice);
    },
    loadNext(file, currentChunk, chunkSize, fileReader, blobSlice) {
      let start = currentChunk * chunkSize;
      let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsBinaryString(blobSlice.call(file, start, end));
    },
    cancleUpload() {
      this.$router.go(-1);
    },
    async submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleFormFile);
          _this.loading = _this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          _this.dialogVisible = false;
          // Check account balances
          _this.queryBanlance();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async queryBanlance() {
      let _this = this;
      // Create the instance
      const wsProvider = new WsProvider("wss://cess.today/rpc2-hacknet/ws/");

      this.api = await ApiPromise.create({ provider: wsProvider });
//        let getHeader =  await this.api.rpc.chain.getBlock('0xe38ff4e60b7b352ffd8daa3c12544b2e3fcf93b9bef904f92b689337b6480cd4')
// console.log("getHeader",getHeader)
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
      let free = acct.data.free.toString(10);
      let freeBalance = (Number(free) / 1000000000000).toFixed(4);
      console.log("freeBalance", freeBalance, typeof freeBalance);
      if (freeBalance > 0) {
        this.uploadPay();
      } else {
        _this.loading.close();
        _this.$message({
          type: "error",
          message: "Insufficient tokens",
        });
      }
    },
    async uploadPay() {
      let _this = this;
      let ADDR = this.$store.state.userInfo.data.myAddress;
      let timestamp = Date.parse(new Date()) / 1000;
      // console.log("timestamp", timestamp);
      let fileID = _this.fileHash + ADDR + timestamp;
      let sha256 = require("js-sha256").sha256;
      this.fileIDHash = "0x" + sha256(fileID);
      //  let aaa = this.toUint8Arr(fileID);
      //  this.fileIDHash = aaa
      console.log("fileIDHash", this.fileIDHash);
      // let test = this.fileIDHash.toU8a();

      console.log("_this.fileHash===========", _this.fileHash);
      let isPublic = _this.ruleFormFile.visibility;
      console.log("_isPublic ", isPublic);
      let uploadCost = Number(_this.storageCost);
      let downloadFee =
        Number(_this.ruleFormFile.estimateSpent) * 1000000000000;
      console.log("fileSize", _this.size);
      let fileSize = Number(_this.size);
      console.log("uploadCost", uploadCost);
      console.log("downloadFee", downloadFee);
      console.log("fileSize", fileSize);
      let date = this.ruleFormFile.expireTime;
      let expireTime = new Date(date).getTime() / 1000;
      expireTime = Number(expireTime);
      console.log("deadline", expireTime);
      const transferExtrinsic = _this.api.tx.fileBank.upload(
        ADDR,
        this.fileIDHash,
        this.fileHash,
        "null",
        isPublic,
        3,
        _this.ruleFormFile.fileCreator,
        fileSize,
        _this.ruleFormFile.keywords,
        _this.ruleFormFile.email,
        uploadCost,
        downloadFee,
        expireTime
      );
      const injector = await web3FromSource(
        _this.$store.state.userInfo.data.account.meta.source
      );

      let txhash = transferExtrinsic
        .signAndSend(
          ADDR,
          { signer: injector.signer },
         async ({ events = [], status }) => {
            console.log("status==========", status);
            console.log("events", events);
            if (status.isInBlock) {
              console.log(
                `Completed at block hash #${status.asInBlock.toString()}`
              );
              _this.fileBlockHash = status.asInBlock.toString()
              _this.loading.close();
              _this.uploadFile();
            } else if (status.isFinalized) {
              console.log(
                `status.isFinalized #${status.asFinalized.toString()}`,
              );
        //   let getBlock  = await _this.api.rpc.chain.getBlock('0xe38ff4e60b7b352ffd8daa3c12544b2e3fcf93b9bef904f92b689337b6480cd4')
        //   console.log("getBlock", getBlock,getBlock.toHuman())
            }else {
              console.log(`Current status: ${status.type}`);
            }
          }
        )
        .catch((error) => {
          console.log(":( transaction failed", error);
          _this.loading.close();
        });
    },
    uploadFile() {
      let date = this.ruleFormFile.expireTime;
      let expireTime = new Date(
        new Date(date.toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1000
      );
      console.log("expireTime=======", expireTime);
      let _this = this;
      let data = {
        estimateSpent: Number(_this.ruleFormFile.estimateSpent),
        expireTime: expireTime,
        md5: _this.md5,
        visibility: _this.ruleFormFile.visibility,
        name: _this.ruleFormFile.name,
        size: _this.size,
        suffix: _this.suffix,
        txHash: _this.fileBlockHash,
        hash: _this.fileHash,
        fid: _this.fileIDHash,
        parentId: 0,
        overview: _this.ruleFormFile.overview,
        classification: Number(_this.ruleFormFile.classification),
        creator: _this.ruleFormFile.fileCreator,
        email: _this.ruleFormFile.email,
        keywords: _this.ruleFormFile.keywords,
        copy: 3,
        priceMb: 1,
      };
      addFileData(data).then((res) => {
        console.log("===", res);
        if (res.success) {
          _this.uploadUrl = res.uploadUrl;
          _this.loading.close();
          _this.uploadtoDataBase();
        } else {
          _this.loading.close();
          if (_this.isEn) {
            _this.$message({
              type: "error",
              message: "File upload failed",
            });
          } else {
            _this.$message({
              type: "error",
              message: res.errorMsg,
            });
          }
        }
      });
    },
    uploadtoDataBase() {
      let _this = this;
      let formData = new FormData();
      _this.getFileInfo = _this.fileInfo;
      formData.append("file", _this.fileInfo);
      _this.isDrawer = true;
      _this.loading = _this.$loading({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      axios
        .post(_this.uploadUrl, formData, {
          cancelToken: _this.source.token,
          onUploadProgress: (progressEvent) => {
            if (_this.isDrawer === true) {
              _this.showProcess = true;
              let process =
                ((progressEvent.loaded / progressEvent.total) * 100) | 0;
              _this.progress = process;
            }
          },
        })
        .then((result) => {
          console.log("uploadresult===", result);
          _this.showProcess = false;
          if (result.data.code === 0) {
            _this.$router.push({
              path: "/myCloud",
            });
            _this.loading.close();
          } else {
            _this.loading.close();
            _this.isSuccess = false;
            _this.isFailed = true;
            _this.$message({
              type: "error",
              message: "Upload failed",
            });
          }
        })
        .catch(() => {
          _this.loading.close();
          _this.isSuccess = false;
          _this.isFailed = true;
          _this.$message({
            type: "error",
            message: "Cancel file upload",
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
body {
  /deep/.el-select-dropdown {
    top: 413px !important;
    left: 1080px !important;
  }
}
.layout-content {
  padding: 36px 50px;
  text-align: left;
  position: relative;
}
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
.uploadFile-container {
  max-width: 1559px;
  height: 1400px;
  background: #ffffff;
  border-radius: 14px;
  margin: 0px auto;
  padding: 31px 204px;
  box-sizing: border-box;
  .upload-img {
    text-align: center;
    margin-bottom: 33px;

    img {
      margin-right: 23px;
    }
    img:last-child {
      margin-bottom: 10px;
    }
  }
  .content {
    height: 1080px;
    width: 100%;
    overflow: hidden;
    padding: 20px;
    box-sizing: border-box;
    color: white;
    .uploadruleFormFile {
      .not-required {
        margin-left: 9px;
        width: 100%;
      }
      /deep/.el-form-item__label {
        font-size: 18px !important;
        line-height: 40px;
        color: #606060;
        padding-left: 8px;
        box-sizing: border-box;
      }
      /deep/.el-input__inner {
        width: 444px !important;
        height: 39px !important;
        background: #f6f7fb !important;
        border: 1px solid #858585 !important;
        border-radius: 8px;
        font-size: 18px !important;
        font-family: "Open-Sans";
      }
      /deep/.el-textarea__inner {
        width: 444px !important;
        height: 245px !important;
        background: #f6f7fb !important;
        border: 1px solid #858585 !important;
        border-radius: 8px;
        font-size: 18px !important;
        font-family: "Open-Sans";
      }
      /deep/.el-textarea__inner::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        cursor: pointer;
      }
      /deep/.el-textarea__inner::-webkit-scrollbar-track {
        background: rgb(239, 239, 239);
        border-radius: 2px;
        cursor: pointer;
      }
      /deep/.el-textarea__inner::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 10px;
        cursor: pointer;
      }
      /deep/.el-textarea__inner::-webkit-scrollbar-thumb:hover {
        background: #333;
        cursor: pointer;
      }
      /deep/.el-textarea__inner::-webkit-scrollbar-corner {
        background: rgb(239, 239, 239);
      }

      .is-required .el-form-item__label {
        padding-left: 0px;
      }
      /deep/.el-radio__label {
        font-size: 18px !important;
      }

      .cost {
        color: #606060;
        font-size: 18px;
      }
      .flex {
        position: relative;
      }
      .upload-btn {
        position: absolute;
        text-align: center;
        height: 39px;
        width: 39px;
        box-sizing: border-box;
        border-radius: 8px;
        top: 0px;
        left: 447px;
        .file-upload {
          filter: alpha(opacity=0);
          opacity: 0;
          position: absolute;
          left: 0;
          top: 0;
          width: 39px;
          height: 39px;
          cursor: pointer;
          font-size: 0;
          border: none;
          outline: none;
        }
      }
      .caculate-tips {
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
        color: #f56c6c;
      }
      .pt .unit {
        position: absolute;
        left: 450px;
        font-size: 18px;
        color: #606060;
      }
    }
    .bottom-btns {
      display: flex;
      justify-content: center;
      margin-top: 60px;
    }
    .cancle-btn {
      width: 172px;
      height: 44px;
      background: linear-gradient(180deg, #8f98b9 0%, #8a9eb5 100%);
      border-radius: 22px;
      color: white;
      font-size: 18px;
      border: none;
    }
    .confirm-btn {
      width: 172px;
      height: 44px;
      background: linear-gradient(180deg, #4a71fe 0%, #8fbfff 100%);
      border-radius: 22px;
      color: white;
      font-size: 18px;
      border: none;
    }
  }
}
.drawer-dialog {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  padding: 12px 0;
  border-radius: 4px;
  z-index: 2999;
  .drawer-main {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #363636;
    .drawer-left {
      display: flex;
      align-items: center;
      font-size: 18px;
      /deep/.el-progress {
        width: 560px;
        z-index: 9999;
      }
      /deep/.el-progress__text {
        display: none;
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0 10px;
        text-align: right;
      }
      .status {
        &.success {
          color: #20d68e;
        }
      }
      .retry {
        width: 200px;
        span {
          color: #fd6b6d;
        }
        margin-left: 10px;
        color: #5078fe;
        cursor: pointer;
      }
    }
    .close-icon {
      min-width: 15px;
      min-height: 15px;
      cursor: pointer;
      background-size: contain;
      background: url(../../assets/icons/close-icon.png) no-repeat;
      background-position: center;
      background-size: contain;
    }
  }
}
@media screen and (max-width: 1367px) {
  .uploadFile-container {
    padding: 31px 50px;
  }
}
</style>
