<template>
  <div class="footer-container">
    
    <div class="footer-top">
      <div class="footer-info">
        <div class="img">
          <img src="../../assets/footer1.png" height="82px" />
        </div>
        <div>Decentralization</div>
        <div>Data is uploaded by the user</div>
      </div>
      <div class="footer-info">
        <div class="img">
          <img src="../../assets/footer3.png" height="82px" />
        </div>
        <div>Data confirmation</div>
        <div>
          Ensure users' ownership of data through blockchain and data detection
          technology
        </div>
      </div>
      <div class="footer-info">
        <div class="img">
          <img src="../../assets/footer2.png" height="82px" />
        </div>
        <div>Distributed storage</div>
        <div>Data is stored in the miner's equipment</div>
      </div>
    </div>
    <div class="footer-bottom">
      Copyright © 2021 CESS Lab All Rights Reserved
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
.footer-container {
  height: 273px;
  background: #005EFF;
}
.footer-top {
  display: flex;
  justify-content: space-between;
  color: #FFFFFF;
    max-width: 1400px;
  margin: 0 auto;
  .footer-info{

    font-weight: bold;
      padding: 48px 0px;
    
  }
  .footer-info div:nth-child(2) {
    font-size: 24px;
  }
  .footer-info div:last-child {
    font-size: 14px;
    width: 372px;
    margin-top: 5px;
  }
  .footer-info img {
    margin-bottom: 9px;
  }
}

.footer-bottom {
  height: 43px;
  font-size: 14px;
  line-height: 43px;
  color:#FFFFFF;
  border-top: 1px solid #3888FF;
background: #005EFF;
}
</style>
