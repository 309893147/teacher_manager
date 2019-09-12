<template>
  <div>
    <List :header="tableHeader" @page="getBanner" :data="tableData" :page="pageInfo">
      <el-table-column label="图片" slot="before">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.url" alt style="max-width:10em" />
        </template>
      </el-table-column>
      <div slot="top-actions">
        <el-button type="primary" @click="showAddDialog=true">新建</el-button>
      </div>

      <el-table-column slot="actions" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 0">使用中</div>
          <div v-if="scope.row.status === 1 ">禁用</div>
        </template>
      </el-table-column>
      <el-table-column slot="actions" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="editItem(scope.row)" size="mini">编辑</el-button>

          <DeleteButton @delete="deleteItem(scope.row)" :data="scope.row" :load="scope.row.loading"></DeleteButton>
        </template>
      </el-table-column>
    </List>

    <el-dialog :visible.sync="showAddDialog" v-if="showAddDialog">
      <el-form label-width="80px">
        <el-form-item label="图片">
          <ImageInput ref="imageInput" v-model="bannerItem.url" url="common/addPictureUrl"></ImageInput>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="bannerItem.status">
            <el-option :value="0" label="启用">启用</el-option>
            <el-option :value="1" label="停用">停用</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="number" value="0" v-model="bannerItem.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button @click="addBanner" type="primary" :loading="loading">保存</el-button>
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
        status: '',
        url: '',
        sort: ''
      },
      showMaModal: false,
      showAddDialog: false,
      addDialog: false,
      showReview: false,
      loading: false,
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
      this.bannerItem = JSON.parse(JSON.stringify(item));
      this.$forceUpdate();
      this.showAddDialog = true;
    },
    deleteItem(item) {
      let vm = this;
      this.ax.post("/common/invitefriendpic/delete", item).then(it => {
        this.getBanner();
      });
    },
    addBanner() {
      let vm = this;
      console.log(this.bannerItem);
      if(this.bannerItem.url && this.bannerItem.status !== '' && this.bannerItem.sort !==''){
        if (!vm.bannerItem.id) {
          this.ax
              .post("/common/invitefriendpic/save", this.bannerItem)
              .then(it => {
                this.getBanner();
                vm.showAddDialog = false;
              })
              .catch(it => {
                vm.error(it);
              });
        } else {
          this.ax
              .post("/common/invitefriendpic/update", this.bannerItem)
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
      this.ax.get("/common/getinvitefriendpic").then(it => {
        vm.listData = it;
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


