<template>
  <div>
    <List
      :data="tableData"
      :header="tableHeader"
      @page="getList"
      :page="pageInfo"
      :disableAction="true"
    >
      <div slot="filters">
        <div>
          <el-input v-model="filter.name" placeholder="订单编号" style="width:auto" clearable></el-input>
          <el-select v-model="filter.status">
            <el-option label="全部状态" :value="null"></el-option>
            <el-option label="未支付" :value="0"></el-option>
            <el-option label="支付成功" :value="1"></el-option>
            <el-option label="已退款" :value="2"></el-option>
          </el-select>
          <el-date-picker
            v-model="filter.startTime"
            type="datetime"
            placeholder="开始时间"
            value-format="timestamp"
          ></el-date-picker>
          <el-date-picker
            v-model="filter.endTime"
            type="datetime"
            placeholder="结束时间"
            value-format="timestamp"
          ></el-date-picker>
          <el-button type="primary" @click="getList(0,20)">筛选</el-button>
        </div>
      </div>
      <el-card shadow="never" v-if="pageInfo.extra" style="width: 100%" slot="statistic">
        <div>金额总计：{{pageInfo.extra.fee}}元</div>
        <div v-if="pageInfo.extra.status != null">
          支付状态：
          <span v-if="pageInfo.extra.status === 0">未支付</span>
          <span v-if="pageInfo.extra.status === 1">支付成功</span>
          <span v-if="pageInfo.extra.status === 2">已退款</span>
        </div>
        <div v-if="pageInfo.extra.startTime">开始时间：{{formatTime(pageInfo.extra.startTime)}}</div>
        <div v-if="pageInfo.extra.endTime">结束时间：{{formatTime(pageInfo.extra.endTime)}}</div>
        <div>记录条数：{{pageInfo.totalElements}}</div>
      </el-card>
    </List>
  </div>
</template>
<script>
import List from "@/components/List";
export default {
  components: {
    List
  },
  name: "userList",
  data() {
    return {
      list: [],
      showDetailDialog: false,
      currentItem: null,
      page: 0,
      outerVisible: false,
      filter: {
        startTime: null,
        endTime: null,
        name: null,
        status: null
      },
      loading: false,
      pageInfo: {},
      role: 1
    };
  },
  created() {
    this.userId = this.$route.query.user;
    this.getList();
  },
  computed: {
    tableData() {
      return this.list.map(it => {
        it.statusName = this.getStatusName(it.status);
        it.typeName = this.getTypeName(it.bizType);
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "orderId",
          name: "订单编号"
        },
        {
          key: "transactionId",
          name: "交易号"
        },
        {
          key: "fee",
          name: "金额"
        },
        {
          key: "body",
          name: "支付内容"
        },
        {
          key: "payTime",
          name: "支付时间"
        },
        {
          key: "statusName",
          name: "状态"
        },
        {
          name: "退款单号",
          key: "refundTransactionId"
        },
        {
          name: "退款时间",
          key: "refundTime"
        },
        {
          key: "createTime",
          name: "创建时间"
        }
      ];
    }
  },
  methods: {
    formatTime(time) {
      let date = new Date(time);

      return (
        [
          date.getFullYear(),
          this.appendZero(date.getMonth() + 1),
          this.appendZero(date.getDate())
        ].join("-") +
        " " +
        [
          this.appendZero(date.getHours()),
          this.appendZero(date.getMinutes()),
          this.appendZero(date.getSeconds())
        ].join(":")
      );
    },
    appendZero(num) {
      if (num < 10) {
        return "0" + num;
      }
      return num;
    },
    getTypeName(status) {
      let statusMap = { 1: "注册", 2: "酒店入住", 3: "网约房" };
      return statusMap[status];
    },
    getStatusName(status) {
      let statusMap = {
        0: "未付款",
        1: "付款成功",
        2: "已退款"
      };
      let statusName = statusMap[status];
      return statusName;
    },
    getList(page, size) {
      let vm = this;
      this.ax("statistic/pay", {
        params: {
          page: page,
          size: size,
          startTime: this.filter.startTime,
          endTime: this.filter.endTime,
          name: this.filter.name,
          status: this.filter.status
        }
      }).then(data => {
        vm.list = data.content;
        delete data.content;
        vm.pageInfo = data;
      });
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  margin: 10px 0;
  text-align: right;
}
.el-row img {
  width: 100%;
}
.item {
  padding: 0.6rem 0;
  border-bottom: solid 1px #ccc;
}
</style>
