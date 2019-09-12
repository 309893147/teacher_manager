<template>
  <div>
    <List :header="tableHeader" :data="tableData" @page="getBanner" :page="pageInfo" width="900">
      <div slot="top-actions">
        <el-button type="primary" @click="addShow()">添加</el-button>
      </div>

      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="editType(scope.row)">编辑</el-button>

          <el-button
            type="danger"
            @click="openDeleteMode(scope.row)"
            slot="reference"
            :loading="scope.row.loading"
          >删除</el-button>
        </template>
      </el-table-column>
    </List>
    <el-dialog :visible.sync="addDialog" :close-on-click-modal="false"	width="400px" >
      <el-form>
        <el-form-item label="类型">
          <el-input v-model="newItem.name" placeholder="名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button @click="addType" type="primary" :loading="loading">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showDelete" width="200px">
      确认是否删除
      <div slot="footer">
        <el-button @click="cloneDeleteMode()">取消</el-button>
        <el-button @click="deleteType()" type="primary" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import List from "@/components/List";
import qs from "qs";
export default {
  components: {
    List
  },
  data() {
    return {
      showDelete: false,
      deleteList: "",
      addDialog: false,
      showReview: false,
      loading: false,
      listData: [],
      pageInfo: {},
      openDetailDialog: false,
      newItem: {},
      editShow: false
    };
  },
  created() {
    this.getBanner();
  },

  methods: {
    addShow(){
      this.editShow= false
      this.addDialog = true;
    },
    openDeleteMode(item) {
      this.deleteList = JSON.parse(JSON.stringify(item));
      this.showDelete = true;
    },
    cloneDeleteMode() {
      this.showDelete = false;
    },
    editType(item) {
      this.editShow= true
      //   Object.assign(this.newItem, item);
      this.newItem = JSON.parse(JSON.stringify(item));
      this.addDialog = true;
    },
    addType() {
      let vm = this;
      if(vm.editShow){
        vm.ax
            .post("/investment/update", vm.newItem)
            .then(it => {
              vm.getBanner();
              vm.cloneInput();
              vm.newItem = {};
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
            .post("/investment/save", vm.newItem)
            .then(it => {
              vm.getBanner();
              vm.cloneInput();
              vm.newItem = {};
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
    },
    deleteType() {
      let vm = this;
      vm.ax
        .post("/investment/delete", this.deleteList)
        .then(it => {
          console.log(it);
          vm.success("删除成功");
          this.getBanner();
          this.cloneDeleteMode();
        })
        .catch(it => {
          vm.error(it);
        });
    },
    cloneInput() {
      this.newItem = "";
      this.addDialog = false;
    },

    getBanner() {
      let vm = this;
      this.ax
        .get("/investment/list")
        .then(it => {
          vm.listData = it.dataList;
          delete it.dataList;
          vm.pageInfo = it;
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
          key: "name",
          name: "类型"
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


