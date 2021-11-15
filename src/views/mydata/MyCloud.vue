<template>
  <div class="layout-content">
    <div class="mycloud-container">
      <div class="mycloud-header">
        <img src="../../assets/icons/home-icon.png" width="17px" /> My data
      </div>
      <div class="action-bar">
        <router-link to="/uploadFile">
          <div class="action-btn">
            <img src="../../assets/icons/upload-btn.png" width="14px" />Upload
          </div>
        </router-link>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="File name">
          <template slot-scope="scope">
            <div class="file-name-column">
              <img :src="scope.row.imageUrl" class="image" />
              <div class="file-name">{{ scope.row.name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="" width="250" class="action-column">
          <template slot-scope="scope">
            <div class="action-btns">
              <span
                class="share-icon"
                @click.stop="handleShareCode(scope.row)"
              ></span>
              <span
                class="download-icon"
                @click.stop="open(1, scope.row)"
              ></span>
              <span class="delete-icon" @click.stop="open(2, scope.row)"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="state" width="150">
          <template slot-scope="scope">
            <div class="state-tag">{{ scope.row.visibility | statusType }}</div>
          </template>
        </el-table-column>
        <el-table-column label="size" width="150">
          <template slot-scope="scope">
            <span class="custom-cell">{{ scope.row.size | sizeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="time" width="150">
          <template slot-scope="scope">
            <span class="custom-cell">{{
              scope.row.createTime | dealWithDate
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @current-change="getData()"
          background
          :current-page.sync="listQuery.page"
          :pager-count="5"
          :page-size="listQuery.pageSize"
          :layout="'prev,pager,next'"
          :total="total"
        ></el-pagination>
        <div class="jumper-bar">
          <el-input v-model="jumpPage" placeholder="Jump to page" type="number">
            <span slot="append">{{ listQuery.page }}/{{ maxlengthPage }}</span>
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
import { parseTime, renderSize, fileType } from "@/utils/valid";
import { filesList, getShareCode, deleteFiles, fileDownload } from "@/api/api";
export default {
  data() {
    return {
      isLoading: false,
      tableData: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        parentId: 0,
      },
      maxlengthPage: 10,
      total: 20,
      jumpPage: 0,
      shareCode: "",
      fileId: null,
      txHash: "",
      type: 1,
      dialogVisible: false,
      content: "",
    };
  },
  filters: {
    statusType(value) {
      const data = ["Private", "Public", "Checking"];
      return data[parseInt(value, 10)];
    },
    sizeFilter(value) {
      return renderSize(value);
    },
    dealWithDate(date) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 85) {
        return value.slice(0, 85) + "...";
      }
      return value;
    },
  },
  mounted() {
    this.listQuery.pageNum = 1;
    this.getFileUploadList(this.listQuery);
  },
  activated() {

  },
  components: {},
  methods: {

    handleClick() {

      if (this.type === 1) {
        this.dialogVisible = false;
        this.isLoading = false;
        this.getFileDownload();
      } else if (this.type === 2) {

        this.isLoading = true;
        deleteFiles(this.fileId)
          .then((res) => {
            console.log("===", res);
            this.isLoading = false;
            if (res.success) {
              this.$message({
                type: "success",
                message: "",
              });
              this.dialogVisible = false;
              this.listQuery.pageNum = 1;
              this.getFileUploadList(this.listQuery);
            } else {
              this.$message({
                type: "error",
                message: '',
              });
            }
          })
          .catch(() => {
            this.isLoading = false;
          });
      }
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
            })
            .then((result) => {
              console.log("===", result);
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

    open(type, row) {
      console.log("ID===", row);
      this.dialogVisible = true;
      this.type = type;
      if (type === 1) {
        this.fileId = row.fileId;
        this.txHash = row.hash;
        this.content = "Download the file ?";
      } else if (type === 2) {
        this.fileId = row.fileId;
        this.content = "Delete the file ?";
      }
    },
    JumpTo() {},
   getFileUploadList(params) {
      this.loading = true;
      filesList(params)
        .then((res) => {
          this.loading = false;
          console.log("===", res.fileInfomationDOList);
          if (res.success) {
            let arr = res.fileInfomationDOList;
            arr.forEach((v) => {
              v.imageUrl = fileType(v.suffix);
              console.log(v.imageUrl);
            });
            this.tableData = arr;
            console.log(this.tableData);
            this.total = res.totalPages;
          } else {
            this.$message({
              type: "error",
              message: res.errorMsg,
            });
          }
        })
        .catch((err) => {
          console.log("err===============", err);
          this.loading = false;
        });
    },
    sortBySize() {
      this.orderType = "size";
      this.sizeDesc = !this.sizeDesc;
      let params = {
        order: this.orderType,
        asc: this.sizeDesc,
      };
      this.listQuery.pageNum = 1;
      params = Object.assign(params, this.listQuery);
      this.getFileUploadList(params);
    },
    sortByTime() {
      this.orderType = "time";
      this.timeDesc = !this.timeDesc;
      let params = {
        order: this.orderType,
        asc: this.timeDesc,
      };
      this.listQuery.pageNum = 1;
      console.log(params);
      params = Object.assign(params, this.listQuery);
      this.getFileUploadList(params);
    },
    handleCommand(command) {
      if (this.newFolderFlag) {
        this.newFolderFlag = false;
      }
      if (command === "time") {
        this.sortByTime();
      } else {
        this.sortBySize();
      }
    },
    handleShareCode(row) {
      getShareCode({
        fileId: row.fileId,
        uploadId: row.uploadId,
      })
        .then((res) => {
          console.log("===========", res);
          if (res.success) {

            this.shareCode = res.shareCode;
            console.log("===", res);
            window.open(`/fileDetail?shareCode=${this.shareCode}`);
          } else {
            this.$message({
              type: "error",
              message: res.errorMsg,
            });
          }
        })
        .catch(() => {
          this.isCopyLoading = false;
        });
    },
  },
};
</script>

<style scoped lang="less">
.layout-content {
  padding: 27px 0px;
}
.mycloud-container {
  width: 1559px;
  height: 1559px;
  background: #ffffff;
  opacity: 1;
  border-radius: 14px;
  margin: 0 auto;
  padding: 0px 12px;
  color: #303030;
  text-align: left;
  /deep/.tableHeader {
    th {
      background: #f6f7fb;
    }
  }
  .pagination-container {
    margin-top: 30px;
    text-align: center;
    position: relative;
    display: flex;
    justify-content: flex-start;
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
      background: #f6f7fb;
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
      background: #f6f7fb;
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
      background: #f6f7fb;
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
        background: #f6f7fb;
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
        background: #f6f7fb;
      }
      /deep/.el-input-group__append {
        position: absolute !important;
        right: 25px !important;
        top: 8px !important;
        background: #f6f7fb !important;
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
        background: #f6f7fb;
      }
    }
  }
}
.mycloud-header {
  padding: 0 20px;
  font-size: 18px;
  padding: 18px 20px;
  border-bottom: 1px solid #d7d7d7;
  img {
    margin-right: 5px;
  }
}
.action-bar {
  display: flex;
  justify-content: flex-start;
  margin: 20px auto 26px;
  margin-left: 53px;
  .action-btn {
    width: 154px;
    height: 32px;
    border: 1px solid #5078fe;
    border-radius: 16px;
    margin-right: 5px;
    color: #5078fe;
    line-height: 32px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    img {
      margin-right: 6px;
    }
  }
}

.share-icon,
.download-icon,
.delete-icon {
  width: 19px;
  height: 19px;
  display: inline-block;
  cursor: pointer;
  margin-left: 20px;
}
.share-icon {
  background: url(../../assets/icons/file-share.png) no-repeat center;
  background-size: contain;
}
.download-icon {
  background: url(../../assets/icons/file-download.png) no-repeat center;
  background-size: contain;
}
.delete-icon {
  background: url(../../assets/icons/file-delete.png) no-repeat center;
  background-size: contain;
}
.file-name-column {
  display: flex;
  align-items: center;
  .image {
    width: 38px;
  }
}
.file-name {
  font-size: 18px;
  line-height: 40px;
  color: #363636;
  margin-left: 30px;
}
.custom-cell {
  font-size: 14px;
  line-height: 40px;
  color: #858585;
}
.state-tag {
  width: 52px;
  height: 16px;
  line-height: 16px;
  background: #6b7fa0;
  border-radius: 3px;
  font-size: 10px;
  color: white;
  text-align: center;
}
.state-tag-pub {
  background: #4f92ff;
}
.state-tag-check {
  background: #ffb609;
}
</style>
