<template>
  <div class="layout-content">
    <div class="mycloud-container">
      <div class="mycloud-header">My data</div>
      <div class="action-bar">
        <router-link to="/uploadFile">
          <div class="action-btn">
            <img src="../../assets/icons/upload-btn.png" width="14px" />Upload
          </div>
        </router-link>
      </div>
      <el-table :data="tableData" style="width: 100%" @row-click="rowClick">
        <el-table-column label="File name">
          <template slot-scope="scope">
            <div class="file-name-column">
              <img :src="scope.row.imageUrl" class="image" />
              <div class="file-name">{{ scope.row.name | ellipsisFilter }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="" width="250" class="action-column">
          <template slot-scope="scope">
            <div class="action-btns">
              <span
                class="share-icon"
                @click.stop="
                  handleShareCode(scope.row.fileId, scope.row.uploadId)
                "
                v-if="scope.row.visibility !== 11"
              ></span>
              <span
                class="download-icon"
                @click.stop="
                  getFileDownload(scope.row.fileId, scope.row.txHash)
                "
                v-if="scope.row.visibility !== 11"
              ></span>
              <span class="delete-icon" @click.stop="open(scope.row)"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="state" width="150">
          <template slot-scope="scope">
            <div
              class="state-tag"
              :class="
                scope.row.visibility == 1
                  ? 'state-tag-pub'
                  : scope.row.visibility == 0
                  ? 'state-tag-private'
                  : ''
              "
            >
              {{ scope.row.visibility | statusType }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="size" width="150">
          <template slot="header" slot-scope="slot">
            <div class="custom-sort">
              <span>size</span>
              <img
                src="../../assets/icons/sort3.png"
                width="14px"
                @click.stop="sortBySize"
              />
            </div>
          </template>
          <template slot-scope="scope">
            <span class="custom-cell">{{ scope.row.size | sizeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="time" width="150">
          <template slot="header" slot-scope="slot">
            <div class="custom-sort">
              <span>time</span>
              <img
                src="../../assets/icons/sort3.png"
                width="14px"
                @click.stop="sortByTime"
              />
            </div>
          </template>
          <template slot-scope="scope">
            <span class="custom-cell">{{
              scope.row.createTime | dealWithDate
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" v-if="total > 10">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :current-page.sync="listQuery.pageNum"
          :pager-count="5"
          :page-size="listQuery.pageSize"
          :layout="'prev,pager,next'"
          :total="total"
        ></el-pagination>
        <div class="jumper-bar" v-if="maxlengthPage > 5">
          <el-input v-model="jumpPage" placeholder="Jump to page" type="number">
            <span slot="append">{{ listQuery.pageNum }}/{{ maxlengthPage }}</span>
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
    <!--shareCode dialog -->
    <el-dialog
      title="Share data"
      :visible.sync="dialogShareVisible"
      :close-on-click-modal="false"
      class="share"
      width="460px"
    >
      <el-form :model="ruleForm" ref="ruleForm" class="share-ruleForm">
        <el-form-item>
          <el-input
            type="textarea"
            resize="none"
            :placeholder="'Share the link'"
            :rows="6"
            readonly
            v-model="ruleForm.linkUrl"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          v-clipboard:copy="shareCode"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          :disabled="isCopyLoading"
          >Copy</el-button
        >
      </span>
    </el-dialog>
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
          @click="handleDeleteClick"
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
import { renderSize, fileType } from "@/utils/valid";
import { filesList, getShareCode, deleteFiles, fileDownload } from "@/api/api";
export default {
  data() {
    return {
      isLoading: false,
      isCopyLoading: true,
      tableData: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        parentId: 0,
      },
      ruleForm: {
        linkUrl: "",
      },
      orderType: "",
      sizeDesc: true,
      timeDesc: false,
      maxlengthPage: 0,
      total: 0,
      jumpPage: "Jump to page",
      shareCode: "",
      fileId: null,
      uploadId: null,
      txHash: "",
      dialogVisible: false,
      dialogShareVisible: false,
      content: "",
    };
  },
  filters: {
    statusType(value) {
      if (value == 0) {
        return "Private";
      } else if (value == 1) {
        return "Public";
      } else {
        return "Checking";
      }
    },
    sizeFilter(value) {
      return renderSize(value);
    },
    dealWithDate(date) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
    ellipsisFilter(value) {
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
  activated() {},
  components: {},
  methods: {
    rowClick(row, column) {
      console.log(row, column);
      this.$router.push({
        path: "/fileDetail",
        query: {
          fileId: row.fileId,
        },
      });
    },
    open(row){
      this.dialogVisible = true;
      this.fileId = row.fileId;
      this.content = "Delete the file ?";
    },
    handleDeleteClick() {
      deleteFiles(this.fileId)
        .then((res) => {
          console.log("===", res);
          this.isLoading = false;
          if (res.success) {
            this.$message({
              type: "success",
              message: "Delete success",
            });
            this.dialogVisible = false;
            this.listQuery.pageNum = 1;
            this.jumpPage = 'Jump to page'
            this.getFileUploadList(this.listQuery);
          } else {
            this.$message({
              type: "error",
              message: "Delete failed",
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getFileDownload(fileId, txHash) {
      fileDownload({
        fileId: fileId,
        txHash: txHash,
      }).then((res) => {
        console.log("===", res);
        if (res.success) {
          let url = 'http://139.224.19.104:8081/file/download'
          let index = res.downloadUrl.indexOf('token') +6;
          let hash = res.downloadUrl.slice(res.downloadUrl.indexOf('download')+9,res.downloadUrl.indexOf('?'))
          let token = res.downloadUrl.slice(index,res.downloadUrl.length);
          console.log("url", url);
          console.log("token",token,);
          console.log("hash", hash);
          let data = {
            hash: hash,
            token:token
          };
          axios
            .post(url,data)
            .then((result) => {
              console.log("===2222222222", result);
              if(result.data.code===0) {
              const link = document.createElement("a");
                link.download = res.downloadInfomationDO.name;
                link.href = result.data.data;
                link.click();
                link.remove();
              } else {
                this.$message({
                  type: "error",
                  message: "",
                });
              }
              // debugger
              // if (result.status === 200) {
              //   let blob = new Blob([result.data]);
              //   let linkUrl = URL.createObjectURL(blob);
              //   const link = document.createElement("a");
              //   link.download = res.downloadInfomationDO.name;
              //   link.href = linkUrl;
              //   link.click();
              //   link.remove();
              // } else {
              //   this.$message({
              //     type: "error",
              //     message: "",
              //   });
              // }
            })
            .catch((error) => {
              console.log("===", error);
            });
        } else {
          this.$message({
            type: "error",
            message: "The file resource is expired!",
          });
        }
      });
    },
    JumpTo() {
      if(this.jumpPage === 'Jump to page') return
      let page = Number(this.jumpPage)
      if(page < 0 ||page === 0){
         page = 1
      }else if(page > this.maxlengthPage){
        page = this.maxlengthPage
      }
      this.handleCurrentChange(page);
      this.jumpPage = 'Jump to page'
    },
    handleCurrentChange(val) {
      let asc = null;
      if (this.orderType === "size") {
        asc = this.sizeDesc;
      } else if (this.orderType === "time") {
        asc = this.timeDesc;
      }
      let params = {
        order: this.orderType,
        asc: asc,
      };
      this.listQuery.pageNum = val;
      params = Object.assign(params, this.listQuery);
      this.getFileUploadList(params);
    },
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
            this.maxlengthPage = Math.ceil(
              this.total / this.listQuery.pageSize
            );
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

    onCopy(e) {
      // console.log(e.text);
      this.dialogShareVisible = false;
      this.$message({
        type: "success",
        message: "Copy success",
        duration: 1000,
      });
    },
    onError(e) {
      this.$message({
        type: "error",
        message: "Copy fail",
      });
    },
    handleShareCode(fileId, uploadId) {
      this.isCopyLoading = true;
      this.dialogShareVisible = true;
      this.ruleForm.linkUrl = "";
      getShareCode({
        fileId: fileId,
        uploadId: uploadId,
      })
        .then((res) => {
          this.isCopyLoading = false;
          if (res.success) {
            this.ruleForm.linkUrl = 'http://' +
              window.location.host + "/data/fileDetail?shareCode=" + res.shareCode;
            this.shareCode = 'http://' +
              window.location.host + "/data/fileDetail?shareCode=" + res.shareCode;
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
  padding: 27px 50px;
  /deep/.el-dialog {
    margin-top: 30vh !important;
    width: 666px !important;
    min-height: 273px;
    background: #ffffff;
    border: 1px solid #d7d7d7;
    border-radius: 14px;
  }
  /deep/.el-dialog__body {
    font-size: 30px;
    line-height: 44px;
    color: #363636;
    text-align: center !important;
  }
  /deep/.el-dialog__footer {
    text-align: center !important;
  }
  /deep/.el-button--medium {
    width: 172px;
    height: 44px;

    border-radius: 22px;
    border: none;
  }
  /deep/.el-button--primary {
    background: linear-gradient(180deg, #4a71fe 0%, #8fbfff 100%);
  }
  /deep/.el-button--default {
    background: linear-gradient(180deg, #fd6b6d 0%, #ed7a5d 100%);
    color: white;
  }
  /deep/.el-button:hover,
  .el-button:focus {
    color: white;
  }
  /deep/.el-dialog__headerbtn {
    display: none;
  }
}
.mycloud-container {
  max-width: 1559px;
  min-height: 850px;
  background: #ffffff;
  opacity: 1;
  border-radius: 14px;
  margin: 0 auto;
  padding: 0px 12px 73px 12px;
  color: #303030;
  text-align: left;
  /deep/.el-table th{
    background: #F6F7FB !important;
  }
  /deep/.el-table tr {
    cursor: pointer;
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
    /deep/.btn-prev:hover,
    /deep/.btn-next:hover {
      color: white;
    }
    /deep/.el-pager li:not(.disabled):hover,
    /deep/.btn-next:hover,
    /deep/.el-pagination.is-background .btn-prev:hover {
      background-color: #005EFF !important;
    }
    /deep/.btn-next,
    /deep/.btn-prev,
    /deep/.el-pager li {
      min-width: 36px !important;
      border-radius: 50%;
      background: #f6f7fb;
    }
    /deep/.el-pagination .is-background {
      display: none;
    }
          /deep/.el-pager .more  {
        height: 36px !important;

      }
    /deep/.el-pager li:hover {
      color: white !important;
    }
    /deep/.el-pager li:not(.disabled).active,
    li:hover {
      width: 36px;
      height: 36px;
      background-color: #005EFF !important;
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
              .jump-btn:hover {
          color: white;
        }
    }
  }
}
.mycloud-header {
  padding: 0 20px;
  font-size: 18px;
  padding: 18px 20px;
  border-bottom: 1px solid #d7d7d7;
  a {
    color: #303030;
  }
  img {
    margin-right: 5px;
  }
}
.share-ruleForm {
  /deep/.el-textarea {
    width: 595px;
    height: 162px;
    background: #f6f7fb;
    border: none;
    border-radius: 8px;
  }
  /deep/.el-textarea__inner {
    background: #f6f7fb;
    border: none;
    border-radius: 8px;
    height: 100%;
    font-size: 18px;
    line-height: 40px;
    color: #363636;
    font-family: "Open-Sans";
  }
  .el-dialog__header {
    font-size: 24px;
    font-family: "Open Sans";
    font-weight: bold;
    line-height: 44px;
    color: #005EFF;
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
    border: 1px solid #005EFF;
    border-radius: 16px;
    margin-right: 5px;
    color: #005EFF;
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
.action-btns {
  text-align: right;
  padding-right: 30px;
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
            white-space: pre-wrap;
  
}
.custom-cell {
  font-size: 14px;
  line-height: 40px;
  color: #858585;
}
.state-tag {
  width: 55px;
  height: 16px;
  line-height: 16px;
  background: #ffb609;
  border-radius: 3px;
  font-size: 10px;
  color: white;
  text-align: center;
}
.state-tag-pub {
  background: #4f92ff;
}
.state-tag-private {
  background: #6b7fa0;
}
.custom-sort {
  display: flex;
  align-items: center;
  img {
    margin-left: 9px;
    cursor: pointer;
  }
}
</style>
