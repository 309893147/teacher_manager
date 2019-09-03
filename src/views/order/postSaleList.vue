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
        <el-select v-model="filter.state">
          <el-option label="全部状态" :value="null"></el-option>
          <el-option label="等待商家处理" value="CREATED"></el-option>
          <el-option label="用户取消" value="CANCELED"></el-option>
          <el-option label="商家同意售后" value="FINISHED"></el-option>
          <el-option label="商家驳回售后" value="REJECTED"></el-option>
        </el-select>

        <el-button type="primary" @click="getBanner(0,20)">筛选</el-button>
      </div>
      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="openDetail(scope.row)" type="primary">查看详情</el-button>
          <el-button @click="agree(scope.row)" type="primary">同意</el-button>
          <el-button @click="reject(scope.row)" type="danger">驳回</el-button>
        </template>
      </el-table-column>
    </List>
    <PostSaleDetail :open="openDetailDialog" @close="openDetailDialog = false" :id="currentItem.id"></PostSaleDetail>
  </div>
</template>
<script>
import List from "@/components/List";
import { getArea } from "@/utils/area";
import PostSaleDetail from "./postSaleDetail";
import qs from "qs";
export default {
  components: {
    List,
    PostSaleDetail
  },
  props: ["type", "filterProperty", "filterId"],
  data() {
    return {
      addDialog: false,
      showReview: false,
      loading: false,
      listData: [],
      pageInfo: {},
      areas: [],
      openDetailDialog: false,
      currentItem: {},
      reviewStatus: null,
      filter: {
        name: null,
        state: null,
        city: null,
        type: null,
        storeId: null,
        startTime: null,
        endTime: null
      },
      currentCity: null,
      extraData: null
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
    getArea().then(it => {
      vm.areas = it.content;
    });
  },
  methods: {
    openDetail(item) {
      this.currentItem = item;
      this.openDetailDialog = true;
    },

    getBanner(page, size) {
      let vm = this;
      this.ax
        .get("order/post_sale", {
          params: {
            page: page,
            size: size,
            ...this.filter
          }
        })
        .then(it => {
          vm.listData = it.content;
          // vm.extraData = it.extra;
          delete it.content;
          vm.pageInfo = it;
        });
    },
    agree(item) {
      console.log(item);
      let vm = this;
      this.ax
        .post("order/post_sale/refund_order", item)
        .then(it => {
          Object.assign(item, it);
          vm.success("退款成功");
        })
        .catch(it => {
          vm.error(it);
        });
    },
    reject(item) {
      console.log(item);
      let vm = this;
      this.ax
        .post("order/post_sale/reject_post_sale", item)
        .then(it => {
          Object.assign(item, it);
          vm.success("已驳回");
        })
        .catch(it => {
          vm.error(it);
        });
    }
  },
  computed: {
    tableData() {
      let state = {
        CREATED: "等待商家处理",
        CANCELED: "用户取消",
        FINISHED: "商家同意售后",
        REJECTED: "商家驳回售后"
      };

      return this.listData.map(it => {
        it.state = state[it.status];
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "createTime",
          name: "申请时间"
        },
        {
          key: "contact",
          name: "联系方式"
        },
        {
          key: "remark",
          name: "用户备注"
        },
        {
          key: "merchantRemark",
          name: "机器备注"
        },
        {
          key: "images",
          name: "附加图片"
        },
        {
          key: "state",
          name: "状态"
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


