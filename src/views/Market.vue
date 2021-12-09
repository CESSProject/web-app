<template>
  <div
    class="market-container layout-content"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div class="market-content">
      <div class="img-box">
        <img src="../assets/DTM-title.png" width="585px" class="img1" />
        <img src="../assets/logo2.png" width="173px" class="img2" />
      </div>
      <div class="market-content-inner">
        <div class="content-left">
          <div class="content-left-header">
            <div class="delete">
              <div>selected</div>
              <div @click="clearFilter"><i class="el-icon-delete"></i></div>
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
        <div class="content-right" v-if="list.length > 0">
          <div class="sort-bar" v-show="!isSearchResult">
            <span
              @click="sortChange(0)"
              :style="sortType === 0 ? 'color:#005EFF' : ''"
              >Correlation<img
                :src="sortType === 0 ? sortSrc1 : sortSrc2"
                width="13px" /></span
            ><span
              @click="sortChange(1)"
              :style="sortType === 1 ? 'color:#005EFF' : ''"
              >Price<img
                :src="sortType === 1 ? sortSrc1 : sortSrc2"
                width="13px"
            /></span>
          </div>
          <div class="sort-bar-result sort-bar" v-show="isSearchResult">
            <div class="result">{{ total }} results found</div>
            <div>
              <span
                @click="sortChange(0)"
                :style="sortType === 0 ? 'color:#005EFF' : ''"
                >Correlation<img
                  :src="sortType === 0 ? sortSrc1 : sortSrc2"
                  width="13px" /></span
              ><span
                @click="sortChange(1)"
                :style="sortType === 1 ? 'color:#005EFF' : ''"
                >Price<img
                  :src="sortType === 1 ? sortSrc1 : sortSrc2"
                  width="13px"
              /></span>
            </div>
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
                </div>
                <div class="file-info-center">
                  <span
                    >File validity period:
                    {{ item.expireTime | dealWithDate }}</span
                  ><span>Sales: {{ item.downloadTimes }}</span>
                  <span>Data size: {{ item.size | sizeFilter }}</span>
                  <div class="price-info">
                    <img src="../assets/icons/download-icon.png" width="24px" />
                    <span>{{ item.estimateSpent }} </span>
                    TCESS
                  </div>
                </div>
                <div class="file-review">
                  <div class="hash">Data ID:{{ item.fid }}</div>
                  <div>Overview: {{ item.overview }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination-container">
            <el-pagination
              @current-change="handleCurrentChange"
              background
              :current-page.sync="queryParams.pageNum"
              :pager-count="5"
              :page-size="queryParams.pageSize"
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
        <div class="content-right content-empty" v-else>
          <img src="../assets/empty.png" width="208px" />
          <p v-show="isSearchResult">no results found...</p>
          <p v-show="!isSearchResult">no data</p>
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
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      fullscreenLoading: true,
      isSearchResult: false,
      sortType: 0,
      sortSrc1: require("../assets/icons/sort1.png"),
      sortSrc2: require("../assets/icons/sort2.png"),
      selectLabel: "Format:",
      list: [],
      pageSize: 10,
      page: 1,
      maxlengthPage: 10,
      jumpPage: "Jump to page",
      total: 0,
      checkAll: true,
      checkedCities: ["All"],
      cities: cityOptions,
      isIndeterminate: true,
      queryParams: {
        classificationList: [],
        formatList: [],
        keyword: "",
        order: "default",
        pageNum: 1,
        pageSize: 10,
      },
      formatList: [],
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
      return moment(date).format("YYYY-MM-DD");
    },
  },
  computed: {
    keyword() {
      console.log("-------------------", this.$store.state.userInfo.searchKey);
      return this.$store.state.userInfo.searchKey;
    },
  },
  watch: {
    keyword(val) {
      console.log("keyword change", val);
      if (val == null) return;
      if (val !== "") {
        this.isSearchResult = true;
        this.queryParams.keyword = this.$store.state.userInfo.searchKey;
        this.checkedCities = ["All"];
        this.queryParams.formatList = [];
        this.queryParams.pageNum = 1;
      } else {
        this.isSearchResult = false;
        this.checkedCities = ["All"];
        this.queryParams.keyword = "";
        this.queryParams.formatList = [];
        this.queryParams.pageNum = 1;
      }
      this.getData(this.queryParams);
    },
  },
  mounted() {
    this.queryParams.keyword =
      this.$route.query.keyword || this.$store.state.userInfo.searchKey;
    this.checkedCities = ["All"];
    this.queryParams.formatList = [];

    this.queryParams.pageNum = 1;
    this.getData(this.queryParams);
  },
  methods: {
    clearFilter() {
      this.selectLabel = "Format: ";
      this.checkedCities = ["All"];
      this.isSearchResult = false;
      this.queryParams.formatList = [];
      this.queryParams.pageNum = 1;
      this.getData(this.queryParams);
    },
    sortChange(val) {
      this.sortType = val;
      console.log(this.sortType);
      this.queryParams.order = this.sortType == 0 ? "default" : "price";
      this.getData(this.queryParams);
    },
    getData() {
      let _this = this;
      queryFilesList(this.queryParams)
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
            if (this.list.length > 0 && this.queryParams.keyword !== null) {
              this.isSearchResult = true;
            }
            this.setSearchKey(null);
            this.fullscreenLoading = false;
          } else {
            this.fullscreenLoading = false;

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

    handleCheckedCitiesChange(value) {
      console.log(value, this.formatList);
      this.formatList = [];
      this.queryParams.formatList = this.formatList;
      this.queryParams.pageNum = 1;
      if (value.length === 0) {
        this.checkedCities.push("All");
        this.selectLabel = "Format: ";
        this.getData(this.queryParams);
        return;
      }
      if (value[value.length - 1] === "All") {
        this.checkedCities = ["All"];
        this.selectLabel = "Format: ";
        this.getData(this.queryParams);
        return;
      }
      if (value.indexOf("All") != -1) {
        value.splice(value.indexOf("All"), 1);
        this.checkedCities = value;
      } else {
        this.checkedCities = value;
      }
      this.selectLabel = "Format: ";
      this.checkedCities.forEach((it) => {
        if (it !== "All") {
          this.formatList.push(it.toLowerCase());
          this.selectLabel = this.selectLabel + it + ";";
        }
      });
      this.queryParams.formatList = this.formatList;
      this.getData(this.queryParams);
    },
    handleCurrentChange(value) {
      console.log(value);
      this.queryParams.pageNum = value;
      this.getData(this.queryParams);
    },
    JumpTo() {
      if (this.jumpPage === "Jump to page") return;
      let page = Number(this.jumpPage);
      if (page < 0 || page === 0) {
        page = 1;
      } else if (page > this.maxlengthPage) {
        page = this.maxlengthPage;
      }
      this.handleCurrentChange(page);
      this.jumpPage = "Jump to page";
    },
    ...mapMutations("userInfo", ["setSearchKey"]),
  },
};
</script>

<style scoped lang="less">
.market-container {
  padding: 40px 50px;

  .img-box {
    height: 118px;
    width: 100%;
    .img1 {
      position: absolute;
      top: 35px;
      right: 590px;
    }
    .img2 {
      position: absolute;
      top: 47px;
      right: 0px;
      z-index: -1;
    }
  }
  .market-content {
    max-width: 1564px;
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
    height: 600px;
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
          color: #363636;
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
        color: #363636;
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
      /deep/.el-checkbox__label {
        font-size: 18px;
      }
      /deep/.el-checkbox__inner {
        width: 18px;
        height: 18px;
      }
      /deep/.el-checkbox__inner::after {
        content: "";
        border: 1px solid #005eff;
        border-color: #005eff;
        border-left: 0;
        border-top: 0;
        width: 5px;
        height: 12px;
        left: 5px;
      }
      /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: white;
        width: 18px;
        height: 18px;
      }
      /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
        color: #005eff;
        font-size: 18px !important;
      }
    }
  }
  .content-empty {
    background: #ffffff;
    border-radius: 14px;
    text-align: center;
    height: 600px !important;
    box-sizing: border-box;
    padding-top: 130px;
    p {
      font-size: 36px;
      line-height: 50px;
      color: #737373;
    }
  }
  .content-right {
    flex: 1;
    background: #f6f7fb;
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
    .sort-bar-result {
      height: 94px;
      background: #ffffff;
      border-radius: 14px;
      justify-content: space-between;
      align-items: center;
      .result {
        font-family: "Open-Sans-Bold";
        line-height: 40px;
        color: #858585;
      }
      span {
        display: inline-block;
      }
    }
    .content-right-inner {
      margin-top: 7px;
      width: 100%;
      cursor: pointer;
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
      text-align: left;
      display: flex;
      justify-content: flex-start;
      max-width: 1190px;
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
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
        white-space: pre-wrap;
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
        color: #363636;
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
            color: #005eff;
            font-weight: bold;
            font-size: 18px;
            margin-right: 8px;
          }
        }
      }
      .file-review {
        line-height: 22px;
        color: #363636;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        word-break: break-all;
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
      /deep/.number,.btn-quicknext {
        height: 36px !important;
        border: none !important;
        padding: 0;
        .el-icon {
          width: 36px !important;
          margin-right: 0px;
        }
      }
      /deep/.el-pager .more  {
        height: 36px !important;

      }
      /deep/.el-pager li {
        line-height: 36px;
        border-radius: 50%;
        background: #ffffff;
        color: #303030;
        margin: 0 10px !important;
      }
      /deep/.el-pager li:not(.disabled):hover,
      /deep/ .btn-next:hover,
      /deep/.btn-prev:hover {
        background-color: #005eff !important;
      }
      /deep/.btn-next,
      /deep/ .btn-prev,
      /deep/.el-pager li {
        min-width: 36px !important;
        border-radius: 50%;
        background: #ffffff;
      }
      /deep/.el-pager li:hover {
        color: white !important;
      }
      /deep/.btn-prev:hover,
      /deep/.btn-next:hover {
        color: white;
      }
      /deep/.el-pagination .is-background {
        display: none;
      }
      /deep/.el-pager li:not(.disabled).active,
      li:hover {
        width: 36px;
        height: 36px;
        background-color: #005eff !important;
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
        .jump-btn:hover {
          color: white;
        }
      }
    }
  }
}
@media screen and (max-width: 1564px) {
  .market-container .img-box .img1 {
    position: absolute;
    top: 35px;
    left: 0px;
  }
}
</style>
