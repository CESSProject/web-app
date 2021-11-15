/* eslint-disable no-debugger */
<template>
  <div class="market-container layout-content">
    <div class="market-content">
      <div class="img-box">
        <img src="../assets/DTM-title.png" width="585px" class="img1" />
        <img src="../assets/logo2.png" width="470px" class="img2" />
      </div>
      <div class="market-content-inner">
        <div class="content-left">
          <div class="content-left-header">
            <div class="delete">
              <div>selected</div>
              <div><i class="el-icon-delete"></i></div>
            </div>
            <div class="select-label">
              <div>{{ selectLabel }}</div>
            </div>
          </div>

          <div class="checkbox-area">
            <p>Format</p>
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
              class="checkbox"
            >
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{
                city
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="content-right">
          <div class="sort-bar">
            <span
              @click="sortChange(0)"
              :style="sortType === 0 ? 'color:#5078FE' : ''"
              >Correlation<img
                :src="sortType === 0 ? sortSrc1 : sortSrc2"
                width="13px" /></span
            ><span
              @click="sortChange(1)"
              :style="sortType === 1 ? 'color:#5078FE' : ''"
              >Price<img
                :src="sortType === 1 ? sortSrc1 : sortSrc2"
                width="13px"
            /></span>
          </div>
          <div
            class="content-right-inner"
            v-for="(item, index) in list"
            :key="index"
            @click="viewDataDetail(item)"
          >
            <div class="content-right-inner-item">
              <div class="file-type">
                <img :src="item.imageUrl" class="image" />
              </div>
              <div class="file-info">
                <div class="file-info-top">
                  <span class="file-name">{{ item.name }}</span>
                  <span class="file-tag">{{
                    item.classification | typeFilter
                  }}</span>
                  <!-- <div class="download-btn" @click.stop="downloadFile">
                    <img
                      src="../assets/icons/download-icon2.png"
                      width="42px"
                    />
                  </div> -->
                </div>
                <div class="file-info-center">
                  <span
                    >File validity period:
                    {{ item.expireTime | dealWithDate }}</span
                  ><span>Download times: {{ item.downloadTimes }}</span>
                  <span>Data size: {{ item.size | sizeFilter }}</span>
                  <div class="price-info">
                    <img src="../assets/icons/download-icon.png" width="24px" />
                    <span>{{ item.estimateSpent }} </span>
                    tCESS
                  </div>
                </div>
                <div class="file-review">
                  <div class="hash">Hash:{{ item.fid }}</div>
                  <div>Overview: {{ item.overview }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination-container">
            <el-pagination
              @current-change="getData()"
              background
              :current-page.sync="page"
              :pager-count="5"
              :page-size="pageSize"
              :layout="'prev,pager,next'"
              :total="total"
            ></el-pagination>
            <div class="jumper-bar" v-if="maxlengthPage > 5">
              <el-input
                v-model="jumpPage"
                placeholder="Jump to page"
                type="number"
              >
                <span slot="append">{{ page }}/{{ maxlengthPage }}</span>
              </el-input>
              <button
                type="button"
                class="jump-btn btn-next"
                @click="JumpTo(jumpPage)"
              >
                <i class="el-icon el-icon-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { types } from "@/utils/config";
const cityOptions = ["All", "Text", "Audio", "Video", "Image", "Others"];
import { queryFilesList } from "@/api/api";
import { renderSize, fileType } from "@/utils/valid";
export default {
  data() {
    return {
      sortType: 0,
      sortSrc1: require("../assets/icons/sort1.png"),
      sortSrc2: require("../assets/icons/sort2.png"),
      selectLabel: "Format: ",
      list: [],
      pageSize: 10,
      page: 1,
      maxlengthPage: 10,
      jumpPage: "Jump to page",
      total: 0,
      checkAll: true,
      checkedCities: ["All", "Text", "Audio", "Video", "Image", "Others"],
      cities: cityOptions,
      isIndeterminate: true,
    };
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
  watch: {
    checkedCities(newVal, oldVal) {
      console.log(newVal, oldVal);
      this.selectLabel = "Format: ";
      this.checkedCities.forEach((it) => {
        if (it !== "All") {
          this.selectLabel = this.selectLabel + it + ";";
        }
      });
    },
  },
  mounted() {
    this.checkedCities.forEach((it) => {
      if (it !== "All") {
        this.selectLabel = this.selectLabel + it + ";";
      }
    });
    this.getData();
  },
  methods: {
    sortChange(val) {
      this.sortType = val;
      this.getData();
    },
    getData() {
      let _this = this;
      let data = {
        classificationList: [],
        formatList: [],
        keyword: "",
        order: this.sortType === 0 ? "default" : "price",
        pageNum: 1,
        pageSize: 10,
      };
      queryFilesList(data)
        .then((res) => {
          if (res.success) {
            console.log("===", res);
            this.list = res.fileList;
            this.list.forEach((v) => {
              v.imageUrl = fileType(v.suffix);
              console.log(v.imageUrl);
            });
            this.total = res.totalPages;
            this.maxlengthPage = Math.ceil(this.total / this.pageSize);
          } else {
            _this.$message({
              type: "error",
              message: "",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    viewDataDetail(value) {
      this.$router.push({
        path: "/fileDetail",
        query: {
          fileId: value.fileId,
        },
      });
    },
    downloadFile() {},

    handleCheckedCitiesChange(value) {
      console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.checkedCities = value;
      console.log("this.checkAll", this.checkAll);
      if (!this.checkAll) {
        let newArr = [];
        this.checkedCities.forEach((item) => {
          if (item !== "All") {
            newArr.push(item);
          }
        });
        this.checkedCities = newArr;
      }
    },
    JumpTo() {},
  },
};
</script>

<style scoped lang="less">
.market-container {
  padding: 40px 0px;

  .img-box {
    height: 118px;
    width: 100%;
    .img1 {
      position: absolute;
      top: 17px;
      right: 782px;
    }
    .img2 {
      position: absolute;
      top: 0px;
      right: 205px;
    }
  }
  .market-content {
    width: 1564px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    height: auto;
  }

  .market-content-inner {
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    top: 108px;
    width: 100%;
    height: 100%;
  }
  .clear {
    clear: both;
  }
  .content-left {
    width: 361px;
    background: #ffffff;
    border-radius: 14px;
    height: 500px;
    margin-right: 14px;
    padding: 20px 32px;
    box-sizing: border-box;
    .content-left-header {
      .delete {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        line-height: 40px;
        color: #303030;
        cursor: pointer;
        i {
          margin-left: 5px;
          color: #606060;
          font-size: 14px;
        }
      }
      .select-label {
        display: block;
        width: 296px;
        background: #f6f7fb;
        border-radius: 4px;
        font-size: 14px;
        line-height: 40px;
        color: #606060;
        text-align: left;
        padding: 0 6px;
        margin-top: 15px;
      }
    }
    p {
      font-size: 18px;
      line-height: 40px;
      color: #303030;
      margin: 47px 0px 20px 0px;
      text-align: left;
    }
    .checkbox {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      /deep/.el-checkbox {
        width: 65px;
        text-align: left;
        margin-top: 10px;
        color: #858585;
        font-size: 18px !important;
      }
      /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
        color: #5078fe;
        font-size: 18px !important;
      }
    }
  }
  .content-right {
    flex: 1;
    height: 2000px;

    .sort-bar {
      width: 100%;
      height: 47px;
      background: #ffffff;
      border-radius: 14px;
      padding: 0px 45px;
      font-size: 18px;
      line-height: 47px;
      display: flex;
      justify-items: flex-start;
      box-sizing: border-box;

      span {
        margin-right: 48px;
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          margin-left: 8px;
        }
      }
    }
    .content-right-inner {
      margin-top: 7px;
      width: 100%;
    }
    .content-right-inner-item {
      height: 253px;
      background: #ffffff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
      opacity: 1;
      border-radius: 14px;
      margin-bottom: 13px;
      padding: 26px 32px 29px 42px;
      box-sizing: border-box;
      font-family: "Open Sans";
      text-align: left;
      display: flex;
      justify-content: flex-start;
      .file-info {
        width: 100%;
      }
      .file-type {
        margin-right: 23px;
        .image {
          width: 54px;
        }
      }
      .file-info-top {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
      }
      .file-name {
        font-size: 24px;
        font-weight: bold;
        height: 33px;
        color: #363636;
        margin-right: 12px;
      }
      .file-tag {
        padding: 3px 12px;
        height: 20px;
        background: #5f788e;
        color: white;
        border-radius: 11px;
        box-sizing: border-box;
        font-size: 12px;
        line-height: 13px;
      }
      .download-btn {
        position: absolute;
        right: 0px;
        cursor: pointer;
      }
      .file-info-center {
        font-size: 14px;
        color: #606060;
        position: relative;
        padding: 17px 0px;
        border-bottom: 1px solid #d7d7d7;
        span {
          margin-right: 20px;
        }
        .line {
          width: 1px;
          height: 10px;
          border: 1px solid #d7d7d7;
        }
        .price-info {
          position: absolute;
          right: 0px;
          color: #303030;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          top: 15px;
          img {
            margin-right: 10px;
          }
          span {
            color: #5078fe;
            font-weight: bold;
            font-size: 18px;
            margin-right: 8px;
          }
        }
      }
      .file-review {
        line-height: 22px;
        color: #606060;
        .hash {
          color: #363636;
          padding: 15px 0px;
        }
      }
    }
    .pagination-container {
      margin-top: 30px;
      text-align: center;
      position: relative;
      display: flex;
      justify-content: center;
      /deep/.el-pagination {
        display: inline-block;
      }
      /deep/.el-pagination,
      /deep/.btn-prev,
      /deep/.btn-next,
      /deep/.el-pager,
      /deep/.number {
        height: 36px !important;
        border: none !important;
        padding: 0;
        .el-icon {
          width: 36px !important;
          margin-right: 0px;
        }
      }
      /deep/.el-pager li {
        line-height: 36px;
        border-radius: 50%;
        background: #ffffff;
        color: #303030;
        margin: 0 10px !important;
      }
      /deep/.el-pagination.is-background .el-pager li:not(.disabled):hover,
      /deep/.el-pagination.is-background .btn-next:hover,
      /deep/.el-pagination.is-background .btn-prev:hover {
        background-color: #5078fe !important;
      }
      /deep/.el-pagination.is-background .btn-next,
      /deep/.el-pagination.is-background .btn-prev,
      /deep/.el-pagination.is-background .el-pager li {
        min-width: 36px !important;
        border-radius: 50%;
        background: #ffffff;
      }
      /deep/.el-pagination .is-background {
        display: none;
      }
      /deep/.el-pagination.is-background .el-pager li:not(.disabled).active,
      li:hover {
        width: 36px;
        height: 36px;
        background-color: #5078fe !important;
        border-radius: 50%;
        border: none !important;
        padding: 0;
        color: white !important;
      }
      /deep/.el-pagination__jump {
        color: #8d8d8d;
      }
      /deep/.el-pagination__editor.el-input .el-input__inner {
        width: 192px;
        height: 36px;
        border: 1px solid #858585;
        border-radius: 18px;
        background: white;
        color: #858585;
      }
      .jumper-bar {
        display: flex;
        position: relative;
        height: 36px !important;
        margin-left: 20px;
        /deep/input::-webkit-outer-spin-button,
        /deep/input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }
        /deep/input[type="number"] {
          -moz-appearance: textfield;
        }
        /deep/.el-input {
          width: 192px;
          height: 36px;
          background: #ffffff;
          border-radius: 18px;
          display: inline-block;
          position: relative;
        }
        /deep/.el-input__inner {
          color: #858585 !important;
          line-height: 36px;
          height: 36px;
          display: block;
          font-size: 14px !important;
          border: none !important;
          border-radius: 18px;
        }
        /deep/.el-input-group__append {
          position: absolute !important;
          right: 25px !important;
          top: 8px !important;
          background: white !important;
          border: none !important;
          font-size: 14px !important;
          color: #858585 !important;
        }
        /deep/.jump-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          line-height: 36px;
          text-align: center;
          color: #858585;
          margin-left: 20px;
          cursor: pointer;
          font-weight: bold;
          background: white;
        }
      }
    }
  }
}
</style>
