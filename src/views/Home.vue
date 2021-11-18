<template>
  <div class="layout-content">
    <div class="home-content">
      <div class="block1">
        <div class="block1-left">
          <div class="block-title">
            one stop data trading<br />service platform
          </div>
          <p>
            Featuring data security, relying on blockchain, distributed cloud
            storage, proxy re encryption and other technical capabilities,
            Provide data storage, data encryption, data right confirmation
            Intelligent data service integrating data management and data
            transaction.
          </p>
        </div>
        <div class="block1-right">
          <img src="../assets/home1.png" width="546px" />
        </div>
      </div>
      <div class="block2">
        <div class="block2-inner">
          <div class="block2-title">
            Popular data<br />
            more user choices
          </div>
          <div class="search-bar">
            <el-input
              v-model="keyword"
              placeholder="Enter data name"
            ></el-input>
            <img
              class="search-icon"
              src="../assets/icons/search.png"
              width="22px"
              @click="searchData"
            />
          </div>
          <div class="popular-data">
            <div class="popular-data-item" @click="showDetail(image[0])">
              <img src="../assets/home2.png" width="85px" class="popular-img" />
              <div class="data-info">
                <div class="data-name">{{ image[0].name }}</div>
                <div class="price">
                  <img
                    :src="require('../assets/icons/download-icon2.png')"
                    width="32px"
                  />
                  <span>Downloads: <br />{{ image[0].downloadTimes }}</span>
                  <div>{{ image[0].estimateSpent }} <br />tCESS</div>
                </div>
              </div>
            </div>
            <div class="popular-data-item" @click="showDetail(text[0])">
              <img
                src="../assets/home3.png"
                width="115px"
                class="popular-img"
              />
              <div class="data-info">
                <div class="data-name">{{ text[0].name }}</div>
                <div class="price">
                  <img src="../assets/icons/download-icon2.png" width="32px" />
                  <span>Downloads: <br />{{ text[0].downloadTimes }}</span>
                  <div>
                    {{ text[0].estimateSpent }}<br />
                    tCESS
                  </div>
                </div>
              </div>
            </div>
            <div class="popular-data-item" @click="showDetail(audio[0])">
              <img src="../assets/home4.png" width="95px" class="popular-img" />
              <div class="data-info">
                <div class="data-name">{{ audio[0].name }}</div>
                <div class="price">
                  <img src="../assets/icons/download-icon2.png" width="32px" />
                  <span>Downloads: <br />{{ audio[0].downloadTimes }}</span>
                  <div>
                    {{ audio[0].estimateSpent }}<br />
                    tCESS
                  </div>
                </div>
              </div>
            </div>
            <div class="popular-data-item" @click="showDetail(video[0])">
              <img src="../assets/home5.png" width="85px" class="popular-img" />
              <div class="data-info">
                <div class="data-name">{{ video[0].name }}</div>
                <div class="price">
                  <img src="../assets/icons/download-icon2.png" width="32px" />
                  <span>Downloads: <br />{{ video[0].downloadTimes }}</span>
                  <div>{{ video[0].estimateSpent }} <br />tCESS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="block3">
        <p class="block3-title">
          CESS data trading market is an official application<br />
          built on CESS public chain and distributed storage system
        </p>
        <div class="block3-inner">
          <div class="block3-inner-item">
            <img src="../assets/home6.png" width="275px" />
            <p>MISSION</p>
            <div class="desc">
              Build a data fusion ecosystem and release the power of data
            </div>
          </div>
          <div class="block3-inner-item">
            <img src="../assets/home7.png" width="428px" />
            <p>VISION</p>
            <div class="desc">
              Leading data circulation, open and neutral platform
            </div>
          </div>
          <div class="block3-inner-item">
            <img src="../assets/home8.png" width="247" />
            <p>LOCATION</p>
            <div class="desc">
              Data transaction and circulation platform in Web3.0 Eras
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { popularFiles } from "@/api/api";

export default {
  data() {
    return {
      keyword: "",
      popularObj: {},
      audio: [],
      text: [],
      video: [],
      image: [],
    };
  },
  created() {
    this.queryPopular();
  },
  mounted() {},
  methods: {
    queryPopular() {
      let _this = this;
      popularFiles().then((res) => {
        console.log("queryPopular===", res);
        if (res.success) {
          _this.popularObj = res.fileMap;
          _this.image = res.fileMap.image;
          _this.text = res.fileMap.text;
          _this.audio = res.fileMap.audio;
          _this.video = res.fileMap.video;
          console.log(_this.popularObj);
        } else {
          _this.$message({
            type: "error",
            message: "",
          });
        }
      });
    },
    searchData() {
      this.$router.push({
        path: "/market",
        query: {
          keyword: this.keyword,
        },
      });
    },
    showDetail(value) {
      this.$router.push({
        path: "/fileDetail",
        query: {
          fileId: value.fileId,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
.layout-content {
  background: white;
}
.home-content {
  width: 100%;
  position: relative;
  z-index: 1;
  margin-top: 65px;
}
.block1 {
  height: 358px;
  display: flex;
  width: 1564px;
  margin: 0 auto;
  justify-content: center;
  .block1-left {
    width: 625px;
    text-align: left;
    margin-right: 123px;
  }
  .block-title {
    font-size: 45px;
    font-family: "AlegreyaSansSC-ExtraBold";
    font-weight: 800;
    line-height: 38px;
    color: #5078fe;
  }
  p {
    font-size: 18px;
    font-weight: 400;
    line-height: 32px;
    color: #363636;
    margin: 34px 0;
  }
}
.block2 {
  height: 1016px;
  background-image: url("../assets/home-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
  margin-top: -75px;
  text-align: left;
  position: relative;
  z-index: -1;
  .block2-inner {
    width: 1564px;
    margin: 0 auto;
    position: relative;
    height: 1016px;
    .block2-title {
      font-size: 30px;
      font-weight: bold;
      line-height: 32px;
      color: #ffffff;
      top: 143px;
      position: absolute;
      left: 170px;
    }
    .search-bar {
      width: 607px;
      height: 55px;
      background: #ffffff;
      border-radius: 28px;
      top: 266px;
      left: 170px;
      position: absolute;
      margin-bottom: 80px;
      /deep/.el-input__inner {
        font-size: 16px;
        font-family: "Roboto";
        font-weight: 500;
        line-height: 55px;
        border: 1px solid #dbdbdb;
        width: 607px;
        height: 55px;
        background: #ffffff;
        border-radius: 28px;
        color: #9f9f9f;
        width: 100%;
        padding: 0 32px;
      }
      .search-icon {
        position: absolute;
        right: 20px;
        top: 28%;
        cursor: pointer;
      }
    }
    .popular-data {
      top: 402px;
      position: absolute;
      display: flex;
      width: 100%;
      justify-content: center;
      margin-bottom: 30px;
      .popular-data-item {
        width: 265px;
        height: 336px;
        background: #f6f7fb;
        border-radius: 8px;
        padding-top: 39px;
        box-sizing: border-box;
        text-align: center;
        margin: 0 23px;
        overflow: hidden;
        cursor: pointer;
        .popular-img {
          height: 95px;
        }
        .data-info {
          background: #f6f7fb;
          margin-top: 36px;
          text-align: left;
          padding: 22px;

          .data-name {
            font-size: 18px;
            font-weight: 400;
            line-height: 26px;
            color: #363636;
            border-bottom: 1px solid #d7d7d7;
            height: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
          }
          .price {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 10px 0px;
            color: #606060;
            span {
              width: 40%;
            }
            div {
              width: 40%;
              text-align: right;
            }
            img {
              height: max-content;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
  .block2-inner::after {
    display: block;
    content: "";
    clear: both;
  }
}
.block3 {
  margin-top: -90px;
  margin-bottom: 74px;
  .block3-title {
    font-size: 30px;
    font-weight: bold;
    line-height: 44px;
    color: #5078fe;
  }
  .block3-inner {
    display: flex;
    justify-content: space-around;
    width: 1564px;
    margin: 0 auto;
    margin-top: 35px;
  }
  .block3-inner-item {
    p {
      font-size: 30px;
      font-family: "Open-Sans-Bold";
      font-weight: 500;
      line-height: 44px;
      color: #363636;
      margin-top: 32px auto 13px;
    }
    .desc {
      font-size: 18px;
      width: 275px;
      line-height: 26px;
      color: #606060;
      margin: 0 auto;
    }
  }
}
</style>
