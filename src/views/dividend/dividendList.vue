<template>
  <div>
    <List :header="tableHeader" @page="getBanner" :data="tableData" :page="pageInfo">
      <div slot="filters">
        <el-input v-model="filter.name" placeholder="订单编号" style="width:auto" clearable></el-input>

        <el-button type="primary" @click="getBanner(1,10)">筛选</el-button>
      </div>
      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <router-link :to="'/project/projectDetailList?id='+scope.row.id">
            <el-button>查看详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </List>
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
      listData: [],
      pageInfo: {},
      showDividend: false,
      currentItem: {},
      filter: {
        name: null
      }
    };
  },
  created() {},
  watch: {},
  methods: {
    openDividendMode(item) {
      this.currentItem = item;
      console.log(item);

      this.showDividend = true;
    },
    cloneDividendMode() {
      this.showDividend = false;
    },

    getBanner(page, size) {
      let vm = this;
      this.ax
        .get("/dividend/list", {
          params: {
            "page.currentPage": page,
            "page.pageSize": size,
            ...this.filter
          }
        })
        .then(it => {
          vm.listData = it.dataList;
          delete it.dataList;
          vm.pageInfo = it.page;
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
          key: "userName",
          name: "用户名"
        },
        {
          key: "unitPrice",
          name: "单价"
        },
        {
          key: "numberCopies",
          name: "份数"
        },
        {
          key: "orderNumber",
          name: "订单号"
        },
        {
          key: "orderDate",
          name: "订单时间"
        },
        {
          key: "countMoney",
          name: "收益金额"
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


