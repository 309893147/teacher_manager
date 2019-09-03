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
        <el-input v-model="filter.name" placeholder="用户名" style="width:auto" clearable></el-input>
        <el-input v-model="filter.contactNumber" placeholder="用户名" style="width:auto" clearable></el-input>

      
        <el-button type="primary" @click="getList(0,20)">筛选</el-button>
      </div>
      <!-- <el-table-column slot="actions" label="操作">
        <template slot-scope="scope">
         
        </template>
      </el-table-column>-->
    </List>
  </div>
</template>
<script>
import List from "@/components/List";
export default {
  components: {
    List
  },
  data() {
    return {
      list: [],
      showDetailDialog: false,
      currentItem: null,
      page: 0,
      outerVisible: false,
      filter: {
        name: null,
        contactNumber: null
      },
      pageInfo: {}
    };
  },
  created() {
    this.getList();
  },
  computed: {
    tableData() {
      return this.list.map(it => {
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
  },
  methods: {
    showDetail(item) {
      this.showDetailDialog = true;
      this.currentItem = item;
    },
    openUserInfo(row) {
      console.log(row);
      this.outerVisible = true;
    },
    getList(page,size) {
      let vm = this;
      this.ax("/user/address/list", {
        params: {
          "page.currentPage": page,
          "page.pageSize": size,
          ...this.filter
        }
      }).then(it => {
        vm.list = it.dataList;
        delete it.dataList;
        vm.pageInfo = it.page;
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
