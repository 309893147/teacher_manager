<template>
  <div>
    <List :data="tableData" :header="tableHeader" @page="getList" :page="pageInfo" >
      <el-table-column label="图片" slot="before">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.images" alt style="max-width:10em">
        </template>
      </el-table-column>
      <div slot="filters">
        <el-input v-model="filter.name" placeholder="内容关键词" style="width:auto" clearable></el-input>
        <el-select v-model="filter.state">
          <el-option label="全部状态" :value="null"></el-option>
          <el-option label="发布中" value="PUBLISHING">发布中</el-option>
          <el-option label="已删除" value="DELETED">已删除</el-option>
        </el-select>
        <el-button type="primary" @click="getList(0,20)">筛选</el-button>
      </div>
      <el-table-column slot="actions" label="操作">
        <template slot-scope="scope">
          <DeleteButton @delete="deleteItem(scope.row)" :data="scope.row" :load="scope.row.loading" v-if="scope.row.status !=='DELETED'"></DeleteButton>
        </template>
    
      </el-table-column>
    </List>
  </div>
</template>
<script>
import List from "@/components/List";
import DeleteButton from "@/components/DeleteButton"
export default {
  props:["type"],
  components: {
    List,
    DeleteButton
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
        name: null,
        mobile: null
      },
      pageInfo: {}
    };
  },
  created() {
    console.log(this.type)
    let role = this.$route.query.role;
    if (!role) {
      role = 1;
    }
    this.role = parseInt(role);
    this.getList();
  },
  computed: {
    statusList() {
      let status = [];
      for (let key in this.statusMap) {
        status.push({ value: key, name: this.statusMap[key] });
      }
      return status;
    },
    tableData() {
      return this.list.map(it => {
        it.statusName = it.status ==='PUBLISHING'?'发布中':'已删除'
        return it;
      });
    },
    tableHeader() {
      let vm = this;
      let hideAddress = this.role !== 2;
      return [
        {
          key:"content",
          name:"内容"
        },
        {
          key:"extra.contact",
          name:"联系方式"
        },
        {
          key:"extra.wechat",
          name:"微信"
        },
        {
          key:"extra.price",
          name:"价格",
          hide: this.type ==="HANGOUT"
        },
        {
          key:"extra.time",
          name:"时间",
          hide: this.type ==="COUPON"
        },
        {
          key:"extra.address",
          name:"地点",
          hide: this.type ==="COUPON"
        },
        {
          key:"statusName",
          name:"状态"
        },
        {
          key: "createTime",
          name: "注册时间"
        }
      ];
    }
  },
  methods: {
    deleteItem(item){
      let vm = this
       this.ax.delete("user/post/"+item.id).then(it =>{
         if(it && it.extra){
            it.extra = JSON.parse(it.extra)
         }
         vm.list = vm.list.map(bi => {
          bi.loading = false;
          if(bi.id === it.id){
              Object.assign(bi,it)
          }
          return bi
        });
        vm.$forceUpdate()
       })
    },
    showDetail(item) {
      this.showDetailDialog = true;
      this.currentItem = item;
    },
    openUserInfo(row) {
      console.log(row);
      this.outerVisible = true;
    },
    getList(page, size) {
      let vm = this;
      this.ax("user/post", {
        params: {
          page: page,
          category:this.type,
          size: size,
          ...this.filter
        }
      }).then(data => {
        vm.list = data.content.map(it => {
          let birth = "";
          if(it.extra){
            it.extra = JSON.parse(it.extra)
          }
          return it;
        });
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
