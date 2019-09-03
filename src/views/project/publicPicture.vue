<template>
  <div>
    <List :header="tableHeader" :data="tableData" @page="getBanner" :page="pageInfo">
      <el-table-column label="图片" slot="before">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.url" alt style="max-width:10em" />
        </template>
      </el-table-column>
      <div slot="top-actions">
        <el-button type="primary" @click="addDialog=true">添加</el-button>
      </div>

      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <!-- <router-link :to="'/project/projectDetailList?id='+scope.row.id">
            <el-button>查看详情</el-button>
          </router-link>-->
          <el-button @click="editPicture(scope.row)" type="primary">编辑</el-button>
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
        <el-form>
          <el-form-item label="图片上传">
            <ImageInput v-model="currentItem.url" url="publicPicture/addPictureUrl"></ImageInput>
          </el-form-item>
          <el-form-item label="排序">
            <el-input type="number" value="0" v-model="currentItem.sort"></el-input>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button @click="addPicture" type="primary" :loading="loading">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showDelete">
      确认是否删除
      <div slot="footer">
        <el-button @click="cloneDeleteMode()">取消</el-button>
        <el-button @click="deletePicture()" type="primary" :loading="loading">确认</el-button>
      </div>
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
      deleteList: ""
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
      console.log(res);
      this.getBanner();
      //对项目id进行附值
      this.currentItem.publicProjectId = res;
    }
  },
  methods: {
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

    deletePicture() {
      let vm = this;
      vm.ax
        .post("/publicPicture/delete", this.deleteList)
        .then(it => {
          vm.currentItem = {};
          vm.success("删除成功");
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
    editPicture(item) {
      this.currentItem = item;
      this.addDialog = true;
    },
    addPicture() {
      let vm = this;
      if (!vm.currentItem.id) {
        vm.ax
          .post("/publicPicture/save", vm.currentItem)
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
            vm.$message.success("操作成功");
          })
          .catch(it => {
            vm.error(it);
          });
      } else {
        vm.ax
          .post("/publicPicture/update", vm.currentItem)
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
            vm.$message.success("操作成功");
          })
          .catch(it => {
            vm.error(it);
          });
      }
      let api = this.publicProjectId;
    },
    getBanner(page, size) {
      if (!this.publicProjectId) {
        return;
      }

      let vm = this;
      vm.currentItem.publicProjectId = this.publicProjectId;
      this.ax
        .get("/publicPicture/list/" + this.publicProjectId)
        .then(it => {
          console.log(it);
          vm.listData = it.dataList;
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    }
  },
  computed: {
    tableData() {
      return this.listData.map(it => {
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "sort",
          name: "排序"
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


