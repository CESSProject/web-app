<template>
  <div class="layout-content">
    <div class="mycloud-container">
      <div class="mycloud-header">
        <img src="../../assets/icons/home-icon.png" width="17px" /> My data
      </div>
      <div class="action-bar">
        <div class="action-btn">
          <img src="../../assets/icons/upload-btn.png" width="14px" />Upload
        </div>
        <div class="action-btn">
          <img src="../../assets/icons/folder-plus.png" width="15px" />New
          Folder
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column label="File name">
          <template slot-scope="scope">
            <div class="file-name-column">
              <img src="../../assets/files/ppt.png" class="image" />
              <div class="file-name">{{ scope.row.filename }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="" width="250" class="action-column">
          <template slot-scope="scope">
            <div class="action-btns">
              <span
                class="share-icon"
                @click.stop="handleShareCode(scope.row.file)"
              ></span>
              <span
                class="download-icon"
                @click.stop="open(1, scope.row.file)"
              ></span>
              <span
                class="delete-icon"
                @click.stop="open(2, scope.row.file)"
              ></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="state" width="150">
          <template slot-scope="scope">
            <div class="state-tag">{{ scope.row.state }}</div>
          </template>
        </el-table-column>
        <el-table-column label="size" width="150">
          <template slot-scope="scope">
            <span class="custom-cell">{{ scope.row.size }}</span>
          </template>
        </el-table-column>
        <el-table-column label="time" width="150">
          <template slot-scope="scope">
            <span class="custom-cell">{{ scope.row.time }}</span>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          filename: "9283y23852",
          state: "Private",
          size: "4324",
          time: "2021-25-14",
        },
        {
          filename: "9283y23852",
          state: "Public",
          size: "4324",
          time: "2021-25-14",
        },
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      maxlengthPage: 10,
      total: 20,
      jumpPage:0,
    };
  },
  components: {},
  methods: {
    JumpTo() {},
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
