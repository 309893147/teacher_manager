<template>
  <div>
    <List
      :header="tableHeader"
      @page="getBanner"
      :data="tableData"
      :page="pageInfo"
      :title="title"
      :disableAction="true"
    ></List>
  </div>
</template>
<script>
import List from "@/components/List";
import qs from "qs";
export default {
  components: {
    List
  },
  props: ["userId"],
  data() {
    return {
      showReview: false,
      loading: false,
      listData: [],
      pageInfo: {},
      detail: {},
      currentItem: {}
    };
  },
  created() {
    //this.userId = this.$route.query.user;
    this.managerId = this.$route.query.manager;
    this.title = this.$route.query.name;
    let vm = this;
  },
  watch: {
    addDialog(val) {
      if (!val) {
        this.currentItem = {};
      }
    }
  },
  methods: {
    getBanner() {
      let vm = this;
      this.ax.get("/user/address/detail/" + this.userId).then(it => {
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
          key: "recipient",
          name: "收件人"
        },
        {
          key: "contactNumber",
          name: "联系人电话"
        },
        {
          key: "area",
          name: "所在地区"
        },
        {
          key: "address",
          name: "详细地址"
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


