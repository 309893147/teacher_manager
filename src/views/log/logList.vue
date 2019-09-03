<template>
  <div>
    <List :header="tableHeader" @page="getBanner" :data="tableData" :page="pageInfo">
      <div slot="filters">
        <el-select v-model="filter.types">
          <el-option label="全部类别" :value="null"></el-option>
          <el-option label="运行" value="RUN"></el-option>
          <el-option label="操作" value="OPERATION"></el-option>
        </el-select>

        <el-button type="primary" @click="getBanner(0,20)">筛选</el-button>
      </div>
      <el-table-column slot="actions" label="操作">
        <template slot-scope="scope">
          <el-button @click="openDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </List>
    <LogDetail :open="openDetailDialog" @close="openDetailDialog = false" :id="currentItem.id"></LogDetail>
  </div>
</template>
<script>
import List from "@/components/List";
import qs from "qs";
import LogDetail from "./logDetail";
export default {
  components: {
    LogDetail,
    List
  },
  data() {
    return {
      loading: false,
      listData: [],
      pageInfo: {},
      openDetailDialog: false,
      filter: {
        name: null,
        type: null
      },
      currentItem: {}
    };
  },
  methods: {
    openDetail(item) {
      this.currentItem = item;
      this.openDetailDialog = true;
    },
    getBanner(page, size) {
      let vm = this;
      this.ax
        .get("log", {
          params: {
            page: page,
            size: size,
            ...this.filter
          }
        })
        .then(it => {
          vm.listData = it.content;
          delete it.content;
          vm.pageInfo = it;
        });
    }
  },

  computed: {
    tableData() {
      let types = {
        RUN: "运行",
        OPERATION: "操作"
      };

      let vm = this;
      return this.listData.map(it => {
        it.types = types[it.type];
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "storeId",
          name: "机器编号"
        },
        {
          key: "types",
          name: "日志类别"
        },
        {
          key: "content",
          name: "内容"
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


