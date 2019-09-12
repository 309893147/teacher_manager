<template>
  <div>
    <List
      :data="tableData"
      :header="tableHeader"
      @page="getList"
      :page="pageInfo"
      :disableAction="true"
    >
      <el-table-column label="图片" slot="before">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.url" alt style="max-width:10em" />
        </template>
      </el-table-column>
      <div slot="filters">
        <el-input v-model="filter.userName" placeholder="名字" style="width:auto" clearable></el-input>
        <el-input v-model="filter.phone" placeholder="手机号" style="width:auto" clearable></el-input>
        <el-input v-model="filter.province" placeholder="邮箱" style="width:auto" clearable></el-input>
<!--        <el-select v-model="filter.state">-->
<!--          <el-option label="全部角色" :value="null"></el-option>-->
<!--          <el-option label="用户" value="USER">用户</el-option>-->
<!--          <el-option label="商家" value="STORE">商家</el-option>-->
<!--        </el-select> &ndash;&gt;-->
        <el-button type="primary" @click="getList(0,20)">筛选</el-button>
      </div>
      <el-table-column slot="actions" label="操作">
        <template slot-scope="scope">
           <router-link :to="'/user/userDetail?id='+scope.row.id">
            <el-button>查看详情</el-button>
          </router-link>
        </template>
      </el-table-column>
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
        userName: null,
        phone: null,
        province: null,
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
        it.sex = it.sex === "1" ? "男" : it.sex === "0" ? "女" : "";
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "userName",
          name: "昵称"
        },
        {
          key: "phone",
          name: "手机号"
        },
        {
          key: "province",
          name: "邮箱"
        },
        {
          key: "integral",
          name: "积分"
        },
        {
          key: "sex",
          name: "性别"
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
      this.outerVisible = true;
    },
    getList(page,size) {
      let vm = this;
      this.ax("user/list", {
        params: {
          "page.currentPage": page > 0 ? page :1,
          "page.pageSize": size,
          ...this.filter

        }
      }).then(data => {
        vm.list = data.dataList;
        vm.pageInfo = data.page;
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
