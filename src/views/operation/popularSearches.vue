<template>
  <div>
    <List :header="tableHeader" @page="getBanner" :data="tableData" :page="pageInfo">
      <div slot="top-actions">
        <el-button type="primary" @click="showAddDialog=true">新建</el-button>
      </div>

      <!-- <el-table-column slot="actions" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 0">使用中</div>
          <div v-if="scope.row.status === 1 ">禁用</div>
        </template>
      </el-table-column>-->
      <el-table-column slot="actions" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="editItem(scope.row)" size="mini">编辑</el-button>

          <DeleteButton @delete="deleteItem(scope.row)" :data="scope.row" :load="scope.row.loading"></DeleteButton>
        </template>
      </el-table-column>
    </List>

    <el-dialog :visible.sync="showAddDialog" v-if="showAddDialog">
      <el-form label-width="80px">
        <el-form-item label="热搜名">
          <el-input  v-model="bannerItem.placeName"></el-input>
        </el-form-item>

        <el-form-item label="排序">
          <el-input type="number" v-model="bannerItem.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button @click="addBanner" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import List from "@/components/List";
import ImageInput from "@/components/ImageInput";
import DeleteButton from "@/components/DeleteButton";
import { getArea } from "@/utils/area";
import qs from "qs";
import Vue from "vue";
export default {
  components: {
    List,
    ImageInput,
    DeleteButton
  },
  data() {
    return {
      bannerItem: {
        status: 0,
        placeName: '',
        sort: ''
      },
      showMaModal: false,
      showAddDialog: false,
      addDialog: false,
      showReview: false,
      listData: [],
      pageInfo: {},
      categories: [],
      reviewStatus: null,
      filter: {
        name: null,
        status: null,
        city: null,
        type: null
      },
      currentItem: {},
      cities: []
    };
  },
  created() {},
  watch: {
    showAddDialog(val) {
      if (!val) {
        this.bannerItem = {};
      }
    }
  },
  methods: {
    selecItem(item) {
      this.$emit("select", item);
    },
    editItem(item) {
      this.bannerItem = Object.assign({}, this.bannerItem, item);
      this.$forceUpdate();
      this.showAddDialog = true;
    },
    deleteItem(item) {
      let vm = this;
      this.ax.post("/common/popularsearches/delete", item).then(it => {
        this.getBanner();
      });
    },
    addBanner() {
      let vm = this;
      if(this.bannerItem.sort && this.bannerItem.placeName ){
        if (!vm.bannerItem.id) {
          this.ax
              .post("/common/popularsearches/add", this.bannerItem)
              .then(it => {
                this.getBanner();
                vm.showAddDialog = false;
              })
              .catch(it => {
                vm.error(it);
              });
        } else {
          this.ax
              .post("/common/popularsearches/update", this.bannerItem)
              .then(it => {
                this.getBanner();
                vm.showAddDialog = false;
              })
              .catch(it => {
                vm.error(it);
              });
        }
      } else {
        this.$message.warning('信息未填写完整')
      }

    },
    getBanner() {
      let vm = this;
      this.ax.get("/common/popularsearches/list").then(it => {
        vm.listData = it.dataList;
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
          key: "placeName",
          name: "热搜名"
        },
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


