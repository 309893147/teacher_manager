<template>
  <div>
    <List :header="tableHeader" @page="getBanner" :data="tableData" :page="pageInfo">
      <div slot="filters">
        <el-input v-model="filter.name" placeholder="订单编号" style="width:auto" clearable></el-input>
        <el-select v-model="filter.orderType">
          <el-option label="全部状态" :value="null"></el-option>
          <el-option label="支付中" :value="0"></el-option>
          <el-option label="已失效" :value="1"></el-option>
          <el-option label="已支付" :value="2"></el-option>
        </el-select>

        <el-button type="primary" @click="getBanner(1,10)">筛选</el-button>
      </div>
      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <!-- <router-link :to="'/project/projectDetailList?id='+scope.row.id">
            <el-button>查看详情</el-button>
          </router-link> -->
          <el-button type="danger" @click="openDividendMode(scope.row)" slot="reference">分红</el-button>
        </template>
      </el-table-column>
    </List>

    <el-dialog :visible.sync="showDividend">
      <el-form>
        <el-form>
          <el-form-item label="分红金额">
            <el-input v-model="currentItem.countMoney" placeholder="当月投资收益"></el-input>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer">
        <el-button @click="cloneDividendMode()">取消</el-button>
        <el-button @click="addDividend()" type="primary">确认</el-button>
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
  props: ["type", "filterProperty", "filterId"],
  data() {
    return {
      listData: [],
      pageInfo: {},
      showDividend: false,
      currentItem: {},
      filter: {
        orderType: null
      }
    };
  },
  created() {
    if (this.filterProperty && this.filterProperty === "store") {
      this.filter.storeId = this.filterId;
    }
    this.userId = this.$route.query.user;
    this.managerId = this.$route.query.manager;
    this.title = this.$route.query.name;
    let vm = this;
  },
  watch: {
    //  showDividend(val) {
    //   if (!val) {
    //     this.currentItem = {};
    //   }
    // },
  },
  methods: {
    openDividendMode(item) {
      this.currentItem = item;
      this.showDividend = true;
    },
    cloneDividendMode() {
      this.showDividend = false;
    },

    addDividend() {
      let vm = this;
      if (!this.validDividend(vm.currentItem)) {
        return;
      }
      let key = "orderId";
      let value = vm.currentItem.id;
      vm.currentItem[key] = value;
      this.ax.post("dividend/add", vm.currentItem).then(it => {
        vm.success("分红成功");
          // this.getBanner();
       cloneDividendMode();

      });
    },

    validDividend(currentItem) {
      let msg = null;
      if (!currentItem.countMoney) {
        msg = "请输入分红金额";
      }
      if (
        currentItem.countMoney >
        currentItem.unit_price * currentItem.number_copies
      ) {
        msg = "分红金额大于客户投资金额";
      }
      if (msg) {
        this.error(msg);
        return false;
      }
      return true;
    },

    getBanner(page, size) {
      let vm = this;
      this.ax
        .get("order/list", {
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
      let orderTypes = {
        0: "支付中",
        1: "已失效",
        2: "已支付"
      };
      return this.listData.map(it => {
        it.orderType = orderTypes[it.orderType];
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "id",
          name: "发布项目编号"
        },
        {
          key: "userName",
          name: "用户名"
        },

        {
          key: "orderType",
          name: "订单状态"
        },
        {
          key: "orderNumber",
          name: "订单份数"
        },
        {
          key: "unitPrice",
          name: "单价"
        },
        {
          key: "orderAmount",
          name: "订单金额"
        },
        {
          key: "orderCode",
          name: "订单编号"
        },
        {
          key: "transactionId",
          name: "微信订单编号"
        },
        {
          key: "createTime",
          name: "下单时间"
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


