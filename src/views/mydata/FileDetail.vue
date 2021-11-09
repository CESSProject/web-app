<template>
  <div class="layout-content">
    <div class="bread">My data <span> > </span> Data detail</div>
    <div class="datadetail-container">
      <div class="data-info-detail">
        <div class="file-header">
          <img src="../../assets/files/doc.png" />
          <div class="price">
            <span
              ><img
                src="../../assets/icons/download-icon.png"
                width="24px" /></span
            ><span>1213</span>tCESS
            <div class="buy-btn">buy</div>
          </div>
        </div>
        <div class="file-info">
          <div class="file-name">Blockchain.doc</div>
          <div class="info-detail">
            <div class="info-label">Classification:</div>
            <div class="info-content">454356345435345435</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Download times:</div>
            <div class="info-content">454354</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Data hash:</div>
            <div class="info-content">5452545425</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Date owner:</div>
            <div class="info-content">4542545</div>
          </div>
          <div class="info-detail">
            <div class="info-label">Data size:</div>
            <div class="info-content"></div>
          </div>
          <div class="info-detail">
            <div class="info-label">Upload time:</div>
            <div class="info-content"></div>
          </div>
          <div class="info-detail">
            <div class="info-label">Data validity period:</div>
            <div class="info-content"></div>
          </div>
          <div class="info-detail">
            <div class="info-label">Proof of existence:</div>
            <div class="info-content"></div>
          </div>
          <div class="info-detail">
            <div class="info-label">Characteristic:</div>
            <div class="info-content"></div>
          </div>
          <div class="info-detail">
            <div class="info-label">Data creator:</div>
            <div class="info-content"></div>
          </div>
          <div class="info-detail">
            <div class="info-label">E-mail:</div>
            <div class="info-content"></div>
          </div>
          <div class="info-detail">
            <div class="info-label">keyword:</div>
            <div class="info-content"></div>
          </div>
          <div class="overview">
            Overview: This is overview. This is overview. This is overview. This
            is overview. This is overview. This is verview. This is overview.
            This is overview. This is overview. This is overview. This is
            overview. This is overview. This is verview. This is overview. This
            is overview. This is overview. This is overview. This is overview.
            This is overview.Overview: This is overview. This is overview. This
            is overview. This is overview. This is overview. This is verview.
            This is overview. This is overview. This is overview. This is
            overview. This is overview. This is overview. This is verview. This
            is overview. This is overview. This is overview. This is overview.
            This is overview. This is overview.Overview: This is overview. This
            is overview. This is overview. This is overview. This is overview.
            This is verview. This is overview. This is overview. This is
            overview. This is overview. This is overview. This is overview. This
            is verview. This is overview. This is overview. This is overview.
            This is overview. This is overview. This is overview.Overview: This
            is overview. This is overview. This is overview. This is overview.
            This is overview. This is verview. This is overview. This is
            overview. This is overview. This is overview. This is overview. This
            is overview. This is verview. This is overview. This is overview.
            This is overview. This is overview. This is overview. This is
            overview.
          </div>
        </div>
      </div>
      <div class="similar-data">
        <p>Similar data</p>
        <div class="sililar-item" v-for="i in 5" :key="i">
          <img src="../../assets/files/doc.png" width="52px" />
          <div>
            <div class="file-name">42352.doc</div>
            <div>Similarity: 23%</div>
            <div>Date owner: Qmy...Ydi</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
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
}
.datadetail-container {
  position: relative;
  width: 1559px;
  margin: 0px auto;
}
.data-info-detail,
.similar-data {
  float: left;
}
.data-info-detail {
  width:auto;
  height: 1200px;
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
   .sililar-item:last-child{
    border-bottom: none;

   }
}
</style>
