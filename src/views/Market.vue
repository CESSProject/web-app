<template>
  <div class="market-container layout-content">
    <div class="market-content">
      <div class="img-box">
        <img src="../assets/DTM-title.png" width="585px" class="img1" />
        <img src="../assets/logo2.png" width="470px" class="img2" />
      </div>
      <div class="market-content-inner">
        <div class="content-left">
          <div></div>
        </div>
        <div class="content-right">
          <div class="sort-bar">
            <span
              >Correlation<img
                :src="sortActive ? sortSrc1 : sortSrc2"
                width="13px" /></span
            ><span
              >Price<img :src="sortActive ? sortSrc1 : sortSrc2" width="13px"
            /></span>
          </div>
          <div class="content-right-inner">
            <div
              class="content-right-inner-item"
              v-for="(item, index) in 10"
              :key="index"
            >
              <div class="file-type">
                <img :src="imageUrl" class="image" />
              </div>
              <div class="file-info">
                <div class="file-info-top">
                  <span class="file-name">Blockchain.doc</span>
                  <span class="file-tag">Higher Education</span>
                  <div class="download-btn">
                    <img
                      src="../assets/icons/download-icon2.png"
                      width="42px"
                    />
                  </div>
                </div>
                <div class="file-info-center">
                  <span>File validity period: 2021-06-23</span
                  ><span>Download times: 12345</span>
                  <span>Data size: 12.38 MB</span>
                  <div class="price-info">
                    <img src="../assets/icons/download-icon.png" width="24px" />
                    <span>43453</span>
                    tCESS
                  </div>
                </div>
                <div class="file-review">
                  <div class="hash">
                    Hash:0x1324639b51be71E89f6c42E1B0b0245619feCE5E
                  </div>
                  <div>
                    Overview: This is overview. This is overview. This is
                    overview. This is overview. This is overview. This is
                    verview. This is overview. This is overview. This is
                    overview. This is overview. This is overview. This is
                    overview. This is verview. This is overview. This is
                    overview. This is overview. This is overview. This is
                    overview. This is overview.
                  </div>
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
            <div class="jumper-bar">
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
export default {
  data() {
    return {
      sortSrc1: require("../assets/icons/sort1.png"),
      sortSrc2: require("../assets/icons/sort2.png"),
      imageUrl: require("../assets/files/ppt.png"),
      sortActive: false,
      list: [],
      pageSize: 10,
      page: 1,
      maxlengthPage: 10,
      total: 20,
    };
  },
  components: {},
  methods: {
    JumpTo() {},
    getData() {},
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
    position: absolute;
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
  }
  .content-right {
    flex: 1;
    height: 500px;

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
      }
      .file-info-center {
        font-size: 14px;
        color: #606060;
        position: relative;
        padding: 17px 0px;
        border-bottom: 1px solid #d7d7d7;
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
            margin-right: 4px;
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
