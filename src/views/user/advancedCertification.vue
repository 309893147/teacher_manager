<template>
  <div>
    <List
      :data="tableData"
      :header="tableHeader"
      @page="getList"
      :page="pageInfo"
      :disableAction="true"
    >
      <el-table-column label="身份证正面" slot="before">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.frontUrl" alt style="max-width:10em" />
        </template>
      </el-table-column>
      <el-table-column label="身份证反面" slot="before">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.backUrl" alt style="max-width:10em" />
        </template>
      </el-table-column>
      <div slot="filters">
        <el-select v-model="filter.type">
          <el-option label="全部状态" :value="null"></el-option>
          <el-option label="未认证" :value="0"></el-option>
          <el-option label="认证中" :value="1"></el-option>
          <el-option label="认证成功" :value="2"></el-option>
          <el-option label="认证失败" :value="3"></el-option>
        </el-select>
        <el-button type="primary" @click="getList(1,20)">筛选</el-button>
      </div>
      <el-table-column slot="actions" label="操作">
        <template slot-scope="scope">
<!--          <router-link :to="'/merchant/detail?id='+scope.row.id">-->
<!--            <el-button>查看详情</el-button>-->
<!--          </router-link>-->
          <el-button @click="editType(scope.row)" type="primary">编辑</el-button>
        </template>
      </el-table-column>
    </List>

    <el-dialog title="认证状态" :visible.sync="dialogVisible" width="30%">
      <el-select v-model="currentItem.type">
        <el-option label="认证成功" :value="2"></el-option>
        <el-option label="认证失败" :value="3"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
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
      dialogVisible: false,
      currentItem: {},
      page: 0,
      outerVisible: false,
      filter: {
        type: null
      },
      pageInfo: {}
    }
  },
  created() {
    this.getList();
  },
  computed: {
    tableData() {
      let type = {
        0: "未认证",
        1: "认证中",
        2: "认证成功",
        3: "认证失败"
      };
      return this.list.map(it => {
        it.type = type[it.type];
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "industry",
          name: "所属行业"
        },
        {
          key: "type",
          name: "认证状态"
        },
        {
          key: "createDate",
          name: "创建时间"
        }
      ];
    }
  },
  methods: {
    editType(item) {
      this.currentItem = JSON.parse(JSON.stringify(item));
      this.dialogVisible = true;
    },
    saveEdit() {
      let vm = this;
      vm.dialogVisible = false;
      console.log(this.currentItem);
      let data ={
        userId: this.currentItem.userId,
        id:  this.currentItem.id,
        type: String(this.currentItem.type)
      }

      this.ax
        .post("/user/update/type", data)
        .then(it => {
          // vm.listData.forEach(item => {
          //   if (item.id == it.id) {
          //     Object.assign(item, it);
          //   }
          // });
          vm.$message.success("操作成功");
          this.getList(1,20)
        })
        .catch(vm.OnError);
    },
    getList(page,size) {
      let vm = this;
      this.ax("/user/advancedauth/list", {
        params: {
          "page.currentPage":  page > 0 ? page :1,
          "page.pageSize": size,
          ...this.filter
        }
      }).then(data => {
        vm.list = data.dataList;
        delete data.dataList;
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
