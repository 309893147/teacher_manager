<template>
  <div>
    <List :header="tableHeader" @page="getBanner" :data="tableData" :page="pageInfo">
      <div slot="filters">
        <el-input v-model="filter.userName" placeholder="用户名" style="width:auto" clearable></el-input>
        <el-select v-model="filter.type">
          <el-option label="全部状态" :value="null"></el-option>
          <el-option label="未打款" :value=0></el-option>
          <el-option label="已打款" :value=1></el-option>
        </el-select>
        <el-button type="primary" @click="getBanner(1,10)">筛选</el-button>
      </div>
      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <!-- <router-link :to="'/project/projectDetailList?id='+scope.row.id">
            <el-button>查看详情</el-button>
          </router-link>-->
          <el-button @click="editType(scope.row)" type="primary">编辑</el-button>
        </template>
      </el-table-column>
    </List>

    <el-dialog title="提现状态" :visible.sync="dialogVisible" width="30%">
      <el-select v-model="currentItem.types">
        <el-option label="已打款" :value=1 ></el-option>
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
import qs from "qs";
export default {
  components: {
    List
  },
  data() {
    return {
      listData: [],
      pageInfo: {},
      dialogVisible: false,
      showDividend: false,
      currentItem: {},
      filter: {
        userName: null,
        type: null
      }
    };
  },
  created() {
    this.getBanner();
  },
  watch: {},
  methods: {
    editType(item) {
      this.currentItem = JSON.parse(JSON.stringify(item));
      this.dialogVisible = true;
    },
cloneInput() {
      this.currentItem = "";
      this.dialogVisible = false;
    },
    saveEdit() {
      let vm = this;

      this.ax
        .post("dividend/update/withdraw", {
          withdrawId: vm.currentItem.id
        })
        .then(it => {
                  this.cloneInput();
          vm.success("提现成功");
          this.getBanner();
        })
        .catch(vm.OnError);
    },

    getBanner(page, size) {
      let vm = this;
      this.ax
        .get("/dividend/list/withdraw", {
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
      let types = {
        0: "未打款",
        1: "已打款"
      };
      return this.listData.map(it => {
        it.type = types[it.type];
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "userDto.userName",
          name: "用户名"
        },
        {
          key: "userDto.email",
          name: "邮箱"
        },
        {
          key: "bankCardDto.bankCardNumber",
          name: "银行卡号"
        },
        {
          key: "bankCardDto.bankCardName",
          name: "银行"
        },

        {
          key: "money",
          name: "提现金额"
        },
        {
          key: "createDate",
          name: "创建时间"
        },
        {
          key: "type",
          name: "打款状态"
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


