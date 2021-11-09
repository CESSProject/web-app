<template>
  <div class="layout-content">
    <div class="bread">My data <span> > </span> Upload</div>
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
          label-width="350px"
          class="demo-ruleFormFile uploadruleFormFile"
        >
          <el-form-item prop="name">
            <span slot="label"> Select file： </span>
            <div class="flex">
              <el-input
                v-model="ruleFormFile.name"
                readonly
                placeholder="'Select file'"
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
              v-model="ruleFormFile.overview"
              placeholder="Please enter an overview"
              class="overview"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="not-required">E-mail：</span>
            <el-input
              type="text"
              v-model="ruleFormFile.overview"
              placeholder="Please enter an overview"
              class="overview"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="not-required">Keywords：</span>
            <el-input
              type="text"
              v-model="ruleFormFile.overview"
              placeholder="Please enter an overview"
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
              placeholder="'Please enter download price'"
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
            class="confirm-btn"
            size="medium"
            type="primary"
            :disabled="confirmDisabled"
            @click="submitForm('ruleFormFile')"
            >Confirm
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { types } from "@/utils/config";
export default {
  data() {
    return {
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
        overview: "",
        fileName: "",
      },
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
      },
      options: types,
      source: {}, 
    };
  },
  computed: {
    storageCost() {
      return 0;
    },
  },
  components: {},
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
  padding: 36px 0px;
  text-align: left;
}
.bread {
  width: 1559px;
  margin: 0px auto;
  margin-bottom: 5px;
  color: #303030;
  font-size: 18px;
}
.uploadFile-container {
  width: 1559px;
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
      }
      /deep/.el-textarea__inner {
        width: 444px !important;
        height: 245px !important;
        background: #f6f7fb !important;
        border: 1px solid #858585 !important;
        border-radius: 8px;
        font-size: 18px !important;
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
</style>
