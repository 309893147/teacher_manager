<template>
  <div>
    <List :header="tableHeader" @page="getBanner" :data="tableData" :page="pageInfo" :title="title">
      <el-table-column label="图片" slot="before">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.content" alt style="max-width:10em" />
        </template>
      </el-table-column>
      <div slot="top-actions" v-if="!mode">
        <el-button type="primary" @click="showAddDialog=true">新建</el-button>
      </div>
      <div slot="filters" v-if="!mode">
        <el-input v-model="filter.name" placeholder="名称" style="width:auto" clearable></el-input>
        <!-- <el-select v-model="filter.city">
          <el-option label="全部城市" :value="null"></el-option>
          <el-option :label="item.title" :value="item.id" v-for="item in cities" :key="item.id"></el-option>
        </el-select>-->
        <el-button type="primary" @click="getBanner(0,20)">筛选</el-button>
      </div>
      <el-table-column slot="actions" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status ==='USING'">使用中</div>
          <div v-if="scope.row.status ==='DISABLED'">禁用</div>
        </template>
      </el-table-column>
      <el-table-column slot="actions" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="editItem(scope.row)" size="mini">编辑</el-button>

          <DeleteButton @delete="deleteItem(scope.row)" :data="scope.row" :load="scope.row.loading"></DeleteButton>
        </template>
      </el-table-column>
    </List>

    <el-dialog title="编辑Banner" :visible.sync="showAddDialog">
      <el-form label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="bannerItem.title"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="bannerItem.type">
            <el-option value="IMAGE" label="图片">静态展示</el-option>
            <el-option value="VIDEO" label="视频">小程序页面</el-option>
          </el-select>
        </el-form-item>
        <template v-if="bannerItem.type === 'IMAGE'">
          <el-form-item label="图片">
            <ImageInput v-model="bannerItem.content" url="ad/file"></ImageInput>
          </el-form-item>
          <el-form-item label="显示时长(秒)">
            <el-input type="number" placeholder="显示时长" v-model="bannerItem.time"></el-input>
          </el-form-item>
        </template>
        <template v-if="bannerItem.type === 'VIDEO'">
          <el-form-item label="图片">
            <ImageInput v-model="bannerItem.content" type="video" url="ad/file"></ImageInput>
          </el-form-item>
        </template>
        <el-form-item label="状态">
          <el-select v-model="bannerItem.status">
            <el-option :value="'USING'" label="启用">启用</el-option>
            <el-option :value="'DISABLED'" label="停用">停用</el-option>
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
    <!-- <el-dialog :visible.sync="showMaModal" title="小程序可跳转链接说明">
      <el-table :data="maData">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="method" label="获取方式"></el-table-column>
        <el-table-column prop="example" label="示例"></el-table-column>
      </el-table>
    </el-dialog>-->
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
  props: ["type", "mode"],
  data() {
    return {
      bannerItem: {
        status: "USING",
        type: "IMAGE",
        title: null,
        cover: null,
        location: null,
        extras: null,
        target: null,
        cityId: null,
        title: null
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
  created() {
    this.userId = this.$route.query.user;
    this.managerId = this.$route.query.manager;
    this.title = this.$route.query.name;
    // this.getCities();
  },
  watch: {
    showAddDialog(val) {
      if (!val) {
        this.bannerItem = {};
      }
    }
  },
  methods: {
    getCities() {
      let vm = this;
      getArea().then(it => {
        vm.cities = it.content;
      });
    },
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
      this.ax.delete("operation/ad/" + item.id).then(it => {
        vm.listData = vm.listData.filter(bi => {
          bi.loading = false;
          return item.id !== bi.id;
        });
        vm.$forceUpdate();
      });
    },
    addBanner() {
      let vm = this;
      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      vm.startLoading();
      this.ax
        .post("operation/ad", this.bannerItem)
        .then(it => {
          vm.stopLoading();
          if (vm.bannerItem.id) {
            vm.listData = vm.listData.filter(item => {
              if (it.id === item.id) {
                Object.assign(item, it);
              }
              return true;
            });
          } else {
            vm.listData.unshift(it);
          }
          vm.showAddDialog = false;
        })
        .catch(it => {
          vm.error(it);
        });
    },
    getBanner() {
      let vm = this;
      this.ax
        .get("/common/getinvitefriendpic", {
          params: {
            ...this.filter
          }
        })
        .then(it => {
          vm.listData = it.dataList;
          let content;
          delete it.content;
          vm.pageInfo = it;
        });
    }
  },
  computed: {
    tableData() {
      let status = {
        USING: "使用中",
        DISABLED: "禁用",
        DELETED: "废除"
      };

      let vm = this;
      return this.listData.map(it => {
        it.statusName = status[it.status];
        return it;
      });
    },

    tableHeader() {
      return [
        {
          key: "title",
          name: "标题"
        },
        {
          key: "sort",
          name: "排序"
        },
        {
          key: "createTime",
          name: "创建时间"
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


