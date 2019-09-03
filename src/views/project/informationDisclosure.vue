<template>
  <div>
    <List :header="tableHeader" :data="tableData" @page="getBanner" :page="pageInfo">
      <div slot="top-actions">
        <el-button type="primary" @click="addDialog=true">添加</el-button>
      </div>

      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
        
            <el-button @click="openPdf(scope.row.file)">查看文件</el-button>
         
          <el-button @click="editTeam(scope.row)" type="primary">编辑</el-button>
          <el-button
            type="danger"
            @click="openDeleteMode(scope.row)"
            slot="reference"
            :loading="scope.row.loading"
          >删除</el-button>
        </template>
      </el-table-column>
    </List>

    <el-dialog :visible.sync="addDialog" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="文件上传">
          <!-- <ImageInput type="file" v-model="currentItem.file" :url="fileUrl"></ImageInput> -->

          <el-upload
            class="upload-demo"
            ref="upload"
            action="/manager/information/addPictureUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="updateSuccess"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >上传到服务器</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="投资人是否可见：" label-width="6rem;">
          <!-- <el-input v-model="currentItem.projectStatus" placeholder></el-input> -->
          <el-select v-model="currentItem.hideType" placeholder="请选择">
            <el-option label="可见" :value= 0 ></el-option>
            <el-option label="不可见" :value= 1 ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input type="number" value="0" v-model="currentItem.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button @click="addFile" type="primary" :loading="loading">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showDelete">
      确认是否删除
      <div slot="footer">
        <el-button @click="cloneDeleteMode()">取消</el-button>
        <el-button @click="deleteTeam()" type="primary" :loading="loading">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="openPdfMode">
      <iframe :src="fileAddress" style="width:100%;height:100%;min-height:500px;"></iframe>
    </el-dialog>
  </div>
</template>
<script>
import List from "@/components/List";
import ImageInput from "@/components/ImageInput";

import qs from "qs";
export default {
  components: {
    List,
    ImageInput
  },
  props: ["publicProjectId"],

  data() {
    return {
      showDelete: false,
      addDialog: false,
      showReview: false,
      loading: false,
      listData: [],
      pageInfo: {},
      openDetailDialog: false,
      currentItem: {},
      deleteList: "",
      fileAddress: '', // 文件地址
      openPdfMode: false,
    };
  },
  created() {
    this.getBanner();
  },
  watch: {
    addDialog(val) {
      if (!val) {
        this.currentItem = {};
        this.currentItem.publicProjectId = this.publicProjectId;
      }
    },

    publicProjectId: function(res) {
      this.getBanner();
      //对项目id进行附值
      this.currentItem.publicProjectId = res;
    }
  },
  methods: {
    // 打开pdf
    openPdf(val){
      if(val){
        this.openPdfMode = true
        this.fileAddress = val
      }
      
    },


    updateSuccess(response, file, fileList) {
      this.currentItem.file = response.body;
      console.log(this.currentItem.file);
      
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      fileList = [];
    },
    handlePreview(file) {},

    openDeleteMode(item) {
      this.deleteList = item;
      this.showDelete = true;
    },
    cloneDeleteMode() {
      this.showDelete = false;
    },
    cloneInput() {
      this.currentItem = "";
      this.addDialog = false;
    },

    deleteTeam() {
      let vm = this;
      vm.ax
        .post("/information/delete", this.deleteList)
        .then(it => {
          vm.success("删除成功");
          vm.currentItem = {};

          this.getBanner();
          this.cloneDeleteMode();
        })
        .catch(it => {
          vm.error(it);
        });
    },
    // openDetail(item) {
    //   this.currentItem = item;
    //   this.addDialog = true;
    // },
    editTeam(item) {
      this.currentItem = item;
      this.addDialog = true;
    },
    addFile() {
      let vm = this;
      //   let api = this.publicProjectId;
      console.log(vm.currentItem);
      
      if (!vm.currentItem.id) {
        vm.ax
          .post("/information/add", vm.currentItem)
          .then(it => {
            vm.getBanner();
            vm.cloneInput();
            vm.currentItem = {};
            vm.listData.forEach(item => {
              if (item.id == it.id) {
                Object.assign(item, it);
              }
              return true;
            });
            vm.$message.success("添加成功");
          })
          .catch(it => {
            vm.error(it);
          });
      } else {
        vm.ax
          .post("/information/update", vm.currentItem)
          .then(it => {
            vm.getBanner();
            vm.cloneInput();
            vm.currentItem = {};
            vm.listData.forEach(item => {
              if (item.id == it.id) {
                Object.assign(item, it);
              }
              return true;
            });
            vm.$message.success("编辑成功");
          })
          .catch(it => {
            vm.error(it);
          });
      }
    },
    getBanner(page, size) {
      if (!this.publicProjectId) {
        return;
      }

      let vm = this;
      vm.currentItem.publicProjectId = this.publicProjectId;
      this.ax
        .get("/information/list", {
          params: {
            "page.currentPage": page,
            "page.pageSize": size,
            publicProjectId: this.publicProjectId
          }
        })
        .then(it => {
          vm.listData = it.dataList;
          delete it.dataList;
          vm.pageInfo = it.page;
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    }
  },
  computed: {
    tableData() {
      let hideType = {
        0 : "可见",
        1 : "不可见"
      };
      console.log(this.listData);

      // let file = this.$GetFileName(file)
      
      return this.listData.map(it => {
        it.hideType = hideType[it.hideType];
        it.file = this.$GetFileName(it.file)
        
        return it;
      });
    },

    
    tableHeader() {
      return [
        {
          key: "file",
          name: "文件"
        },
        {
          key: "sort",
          name: "排序"
        },
        {
          key: "hideType",
          name: "投资人是否可见"
        }
      ];
    }
  }
};
</script>
<style scoped>
.detail-table {
  border-collapse: collapse;
}
.detail-table,
.detail-table .el-row,
.detail-table th,
.detail-table tr {
  border-bottom: solid 1px lightgrey;
}

.detail-table img {
  max-width: 10em;
  height: auto;
}
.detail-table .title {
  display: inline-block;
  vertical-align: top;
  font-size: 16px;
  padding-right: 10px;
  font-weight: bolder;
}
</style>


