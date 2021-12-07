<template>
  <div class="layout-content">
    <div class="home-content">
      <div class="block1">
        <div class="block1-left">
          <div class="block-title">
            <div class="title1"><span>O</span>ne stop</div>
            <div>Data trading service platform.</div>
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
          <div class="circle">
            <img src="../assets/icons/dot.png" class="dot" />
          </div>
          <div class="block-title">
            <div class="title1"><span>P</span>opular data</div>
            <div>more user choices.</div>
          </div>
          <div class="search-bar">
            <el-input
              v-model="keyword"
              placeholder="Enter data name"
            ></el-input>
            <div class="search-icon" @click="searchData">
              <img src="../assets/icons/search2.png" width="22px" />
            </div>
          </div>
          <div class="popular-data">
            <div
              class="popular-data-item"
              @click="showDetail(text[0])"
              v-if="text.length > 0"
            >
              <img src="../assets/home2.png" width="85px" class="popular-img" />
              <div class="data-info">
                <div class="data-name">{{ text[0].name }}</div>
                <div class="price">
                  <img src="../assets/icons/download-icon2.png" width="32px" />
                  <div class="price-inner">
                    <div class="price-info">
                      <div>Downloads:</div>
                      <div>{{ text[0].downloadTimes }}</div>
                    </div>
                    <div class="price-info">
                      <div>Price:</div>
                      <div>{{ text[0].estimateSpent }} TCESS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="popular-data-item"
              @click="showDetail(audio[0])"
              v-if="audio.length > 0"
            >
              <img
                src="../assets/home3.png"
                width="115px"
                class="popular-img"
              />
              <div class="data-info">
                <div class="data-name">{{ audio[0].name }}</div>
                <div class="price">
                  <img src="../assets/icons/download-icon2.png" width="32px" />
                  <div class="price-inner">
                    <div class="price-info">
                      <div>Downloads:</div>
                      <div>{{ audio[0].downloadTimes }}</div>
                    </div>
                    <div class="price-info">
                      <div>Price:</div>
                      <div>{{ audio[0].estimateSpent }} TCESS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="popular-data-item"
              @click="showDetail(video[0])"
              v-if="video.length > 0"
            >
              <img src="../assets/home4.png" width="95px" class="popular-img" />
              <div class="data-info">
                <div class="data-name">{{ video[0].name }}</div>
                <div class="price">
                  <img src="../assets/icons/download-icon2.png" width="32px" />
                  <div class="price-inner">
                    <div class="price-info">
                      <div>Downloads:</div>
                      <div>{{ video[0].downloadTimes }}</div>
                    </div>
                    <div class="price-info">
                      <div>Price:</div>
                      <div>{{ video[0].estimateSpent }} TCESS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="popular-data-item"
              @click="showDetail(image[0])"
              v-if="image.length > 0"
            >
              <img src="../assets/home5.png" width="85px" class="popular-img" />
              <div class="data-info">
                <div class="data-name">{{ image[0].name }}</div>
                <div class="price">
                  <img src="../assets/icons/download-icon2.png" width="32px" />
                  <div class="price-inner">
                    <div class="price-info">
                      <div>Downloads:</div>
                      <div>{{ image[0].downloadTimes }}</div>
                    </div>
                    <div class="price-info">
                      <div>Price:</div>
                      <div>{{ image[0].estimateSpent }} TCESS</div>
                    </div>
                  </div>
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
        <div class="circle2"></div>
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
import { mapMutations } from "vuex";

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
      this.setSearchKey(this.keyword);
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
    ...mapMutations("userInfo", ["setSearchKey"]),
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
  overflow: hidden;
  // max-width: 1400px;
      padding: 0 253px;
    box-sizing: border-box;
  min-width: 980px;
  margin: 0 auto;
}
.block-title {
  font-size: 45px;
  font-weight: 800;
  line-height: 45px;
  color: #0e0e0e;
  .title1 {
    font-size: 60px;
    margin-bottom: 35px;
    span {
      color: #005eff;
    }
  }
  .title2 {
    font-size: 36px;
  }
}
.block1 {
  height: 800px;
  display: flex;
  max-width: 1564px;
  margin: 0 auto;
  justify-content: space-between;
  .block1-left {
    width: 625px;
    text-align: left;
    margin-right: 123px;
    margin-top: 183px;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 32px;
    margin: 37px 0;
    color: #383838;
  }
  .block1-right {
    background-image: url("../assets/home1-bg.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: 15px 25px;
  }
}
.block2 {
  height: 800px;
  margin-top: 20px;
  text-align: left;
  position: relative;
  z-index: -1;
  .circle {
    background-image: url("../assets/circle1.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
    width: 922px;
    height: 922px;
    z-index: -1;
    left: -250px;
    top: -350px;
    position: absolute;
    .dot {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 134px;
      left: 176px;
    }
  }
  .block2-inner {
    max-width: 1564px;
    margin: 0 auto;
    position: relative;
    height: 800px;
    z-index: 10;
    .search-bar {
      width: 943px;
      height: 74px;
      background: #ffffff;
      border-radius: 28px;
      margin-bottom: 80px;
      margin-top: 58px;
      position: relative;
      /deep/.el-input__inner {
        font-size: 16px;
        font-family: "Roboto";
        font-weight: 500;
        line-height: 74px;
        width: 943px;
        height: 74px;
        background: #f6f7fb;
        border: 1px solid #005eff;
        border-radius: 11px;
        color: #9f9f9f;
        width: 100%;
        padding: 0 32px;
      }
      .search-icon {
        position: absolute;
        right: -85px;
        top: 0;
        width: 74px;
        height: 74px;
        background: #f6f7fb;
        border: 1px solid #005eff;
        border-radius: 11px;
        text-align: center;
        line-height: 85px;
        cursor: pointer;
      }
    }
    .popular-data {
      display: flex;
      width: 100%;
      justify-content: flex-start;
      margin-bottom: 30px;
      .popular-data-item {
        width: 265px;
        height: 336px;
        border-radius: 8px;
        padding-top: 39px;
        box-sizing: border-box;
        text-align: center;
        margin: 0 23px;
        background: white;
        border: 1px solid #b9c7ff;
        box-shadow: 0px 8px 17px #b9c7ff;
        overflow: hidden;
        cursor: pointer;
        transform: translateY(0);
        transition: transform 0.4s;

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
            height: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            white-space: pre-wrap;
          }
          .price {
            padding: 10px 0px;
            border-top: 1px solid #d7d7d7;
            margin-top: 15px;
            display: flex;
            justify-content: flex-start;
            .price-inner {
              text-align: left;
              flex: 1;
            }
            .price-info {
              display: flex;
              justify-content: space-between;
              text-align: right;
              div:last-child {
                text-align: right;
              }
            }
            img {
              height: max-content;
              margin-right: 8px;
              margin-top: 5px;
            }
          }
        }
      }
      .popular-data-item:hover {
        transform: translateY(-20px);
        box-shadow: 0px 8px 17px rgba(42, 84, 253, 0.6);
        transition: transform 0.4s;
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
  margin-bottom: 74px;
  position: relative;
  .circle2 {
    background-image: url("../assets/circle2.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
    width: 298px;
    height: 298px;
    right: -149px;
    top: -50px;
    z-index: -1;
    position: absolute;
  }
  .block3-title {
    font-size: 32px;
    font-weight: bold;
    line-height: 44px;
    color: #0e0e0e;
    margin-bottom: 100px;
    text-align: left;
  }
  .block3-inner {
    display: flex;
    justify-content: space-between;
    max-width: 1564px;
    margin: 0 auto;
    margin-top: 35px;
  }
  .block3-inner-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    p {
      font-size: 30px;
      font-family: "Open-Sans-Bold";
      font-weight: 500;
      line-height: 44px;
      color: #0e0e0e;
      margin-top: 32px auto 13px;
    }
    .desc {
      font-size: 18px;
      width: 275px;
      line-height: 26px;
      margin: 0 auto;
    }
  }
}
@media screen and (max-width: 1366px) {
  .home-content {
    width: 100%;
    padding: 0 100px;
    box-sizing: border-box;
  }
}
</style>
