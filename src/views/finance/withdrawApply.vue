<template>
  <div>
    <List
      :header="tableHeader"
      @page="getBanner"
      :data="tableData"
      :page="pageInfo"
      :title="title"
      :noTopAction="true"
    >
      <div slot="filters">
        <el-input v-model="filter.name" placeholder="账号/账号名称/账号" style="width:auto" clearable></el-input>
        <el-select v-model="currentCity">
          <el-option label="全部城市" :value="null"></el-option>
          <el-option
            v-for="(item,index) in areas"
            :key="item.title"
            :value="index"
            :label="item.title"
          >{{item.title}}</el-option>
        </el-select>
        <el-select v-model="filter.storeId">
          <el-option label="全部店铺" :value="null"></el-option>
          <el-option
            label="请先选择城市"
            :value="-1"
            v-if="!(areas && areas[currentCity] && areas[currentCity].stores)"
          ></el-option>
          <template v-else>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in areas[currentCity].stores"
              :key="item.id"
            ></el-option>
          </template>
        </el-select>
        <el-select v-model="filter.state">
          <el-option label="全部状态" :value="null"></el-option>
          <el-option label="等待处理" value="CREATED"></el-option>
          <el-option label="已驳回" value="REJECTED"></el-option>
          <el-option label="已打款" value="PASS"></el-option>
        </el-select>
        <el-button type="primary" @click="getBanner(0,20)">筛选</el-button>
      </div>
      <el-table-column slot="actions" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="reviewStore(scope.row,'PASS',scope.$index)"
            size="mini"
            v-if="scope.row.status === 'CREATED'"
          >打款</el-button>
          <el-button
            @click="reviewStore(scope.row,'REJECTED',scope.$index)"
            size="mini"
            v-if="scope.row.status === 'CREATED'"
          >驳回</el-button>
          <el-button @click="checkMessage(scope.row)" size="mini" v-if="scope.row.messages">信息</el-button>
        </template>
      </el-table-column>
    </List>
  </div>
</template>
<script>
import List from "@/components/List";
import { getArea } from "@/utils/area";
import qs from "qs";
export default {
  components: {
    List
  },
  props: ["type"],
  data() {
    return {
      addDialog: false,
      showReview: false,
      loading: false,
      listData: [],
      pageInfo: {},
      areas: [],
      reviewStatus: null,
      filter: {
        name: null,
        state: null,
        city: null,
        type: null,
        storeId: null
      },
      currentCity: null
    };
  },
  created() {
    this.userId = this.$route.query.user;
    this.managerId = this.$route.query.manager;
    this.title = this.$route.query.name;
    let vm = this;
    getArea().then(it => {
      vm.areas = it.content;
    });
  },
  watch: {
    addDialog(val) {
      if (!val) {
        this.currentItem = {};
      }
    },
    currentCity(val) {
      if (val != null && this.areas) {
        let city = this.areas[val];
        if (!city) {
          return;
        }
        this.filter.city = city.id;
        if (!city.stores) {
          this.getCityStore(city);
        }
      }
    }
  },
  methods: {
    getCityStore(city) {
      let vm = this;
      this.ax.get("store/city?cityId=" + city.id).then(it => {
        city.stores = it;
        vm.$forceUpdate();
      });
    },
    reviewStore(store, status, index, reason) {
      store.status = status;
      let vm = this;
      if (status === "REJECTED" && !reason) {
        this.$prompt("请输入原因", "驳回原因").then(it => {
          let bb = it.value;
          if (!bb) {
            vm.OnError("请输入原因");
            return;
          }
          vm.reviewStore(store, status, index, bb);
        });
        return;
      }
      let payload = {
        status: status
      };
      if (reason) {
        payload.remark = reason;
      }
      this.ax
        .post("store/withdraw/apply/" + store.id, qs.stringify(payload))
        .then(it => {
          vm.listData[index] = it;
          vm.success("操作成功");
        })
        .catch(vm.OnError);
    },
    getBanner(page, size) {
      let vm = this;
      this.ax
        .get("store/withdraw/apply", {
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
      let status = {
        CREATED: "等待处理",
        REJECTED: "已驳回",
        PASS: "已打款"
      };
      return this.listData.map(it => {
        it.statusName = status[it.status];
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "accountName",
          name: "账户名称"
        },
        {
          key: "bankAccount",
          name: "账号"
        },
        {
          key: "bsb",
          name: "BSB"
        },
        {
          key: "abn",
          name: "ABN"
        },
        {
          key: "money",
          name: "金额"
        },
        {
          key: "statusName",
          name: "状态"
        },
        {
          key: "remark",
          name: "备注"
        },
        {
          key: "createTime",
          name: "申请时间"
        },
        {
          key: "updateTime",
          name: "更新时间"
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


