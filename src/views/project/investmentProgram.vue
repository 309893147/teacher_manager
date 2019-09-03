<template>
  <div>
    <List :header="tableHeader" :data="tableData" @page="getBanner" :page="pageInfo">
      <div slot="top-actions">
        <el-button type="primary" @click="addDialog=true">添加</el-button>
      </div>

      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="editProgram(scope.row)" type="primary">编辑</el-button>
          <el-button
            type="danger"
            @click="openDeleteMode(scope.row)"
            slot="reference"
            :loading="scope.row.loading"
          >删除</el-button>
        </template>
      </el-table-column>
    </List>

    <el-dialog :visible.sync="addDialog" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="标题：" label-width="6rem;">
          <el-input v-model="currentItem.title" placeholder></el-input>
        </el-form-item>
        <el-form-item label="限购份数：" label-width="6rem;">
          <el-input v-model="currentItem.limitPurchases" placeholder></el-input>
        </el-form-item>
        <el-form-item label="单价：" label-width="6rem;">
          <el-input v-model="currentItem.unitPrice" placeholder></el-input>
        </el-form-item>
        <el-form-item label="现金回报：" label-width="6rem;">
          <el-input v-model="currentItem.cashReturn" placeholder></el-input>
        </el-form-item>
        <el-form-item label="消息回报：" label-width="6rem;">
          <el-input v-model="currentItem.messageReturn" placeholder></el-input>
        </el-form-item>
        <el-form-item label="退出机制：" label-width="6rem;">
          <el-input v-model="currentItem.exitMechanism" placeholder></el-input>
        </el-form-item>
        <el-form-item label="结束时间: " label-width="6rem;">
          <el-date-picker
            v-model="currentItem.endDate"
            type="datetime"
            placeholder="结束时间"
            default-time="00:00:00"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>

        <!-- <el-form-item label="剩余份数：" label-width="6rem;">
            <el-input v-model="currentItem.location" placeholder></el-input>
          </el-form-item>

          <el-form-item label="积分：" label-width="6rem;">
            <el-input v-model="currentItem.longitude" placeholder></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button @click="addProgram" type="primary" :loading="loading">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showDelete">
      确认是否删除
      <div slot="footer">
        <el-button @click="cloneDeleteMode()">取消</el-button>
        <el-button @click="deleteProgram()" type="primary" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import List from "@/components/List";
import ImageInput from "@/components/ImageInput";

import qs from "qs";
export default {
  components: {
    List,
    ImageInput
  },
  props: ["publicProjectId"],

  data() {
    return {
      showDelete: false,
      addDialog: false,
      showReview: false,
      loading: false,
      listData: [],
      pageInfo: {},
      openDetailDialog: false,
      currentItem: {},
      deleteList: ""
    };
  },
  created() {
    this.getBanner();
  },
  watch: {
    addDialog(val) {
      if (!val) {
        this.currentItem = {};
        this.currentItem.publicProjectId = this.publicProjectId;
      }
    },

    publicProjectId: function(res) {
      console.log(res);
      this.getBanner();
      //对项目id进行附值
      this.currentItem.publicProjectId = res;
    }
  },
  methods: {
    openDeleteMode(item) {
      this.deleteList = item;
      this.showDelete = true;
    },
    cloneDeleteMode() {
      this.showDelete = false;
    },
    cloneInput() {
      this.currentItem = "";
      this.addDialog = false;
    },

    deleteProgram() {
      let vm = this;
      vm.ax
        .post("/investmentProgram/delete", this.deleteList)
        .then(it => {
          console.log(it);
          vm.success("删除成功");
          this.getBanner();
          this.cloneDeleteMode();
        })
        .catch(it => {
          vm.error(it);
        });
    },
    // openDetail(item) {
    //   this.currentItem = item;
    //   this.addDialog = true;
    // },
    editProgram(item) {
      this.currentItem = item;
      this.addDialog = true;
    },
    addProgram() {
      let vm = this;
      if (!vm.currentItem.id) {
        vm.ax
          .post("/investmentProgram/save", vm.currentItem)
          .then(it => {
            vm.getBanner();
            vm.cloneInput();
            vm.newItem = {};
            vm.listData.forEach(item => {
              if (item.id == it.id) {
                Object.assign(item, it);
              }
              return true;
            });
            vm.$message.success("操作成功");
          })
          .catch(it => {
            vm.error(it);
          });
      } else {
        vm.ax
          .post("/investmentProgram/update", vm.currentItem)
          .then(it => {
            vm.getBanner();
            vm.cloneInput();
            vm.newItem = {};
            vm.listData.forEach(item => {
              if (item.id == it.id) {
                Object.assign(item, it);
              }
              return true;
            });
            vm.$message.success("操作成功");
          })
          .catch(it => {
            vm.error(it);
          });
      }
    },
    getBanner() {
      if (!this.publicProjectId) {
        return;
      }

      let vm = this;
      vm.currentItem.publicProjectId = this.publicProjectId;
      this.ax
        .get("/investmentProgram/list/" + this.publicProjectId)
        .then(it => {
          console.log(it);
          vm.listData = it.dataList;
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
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
          key: "title",
          name: "标题"
        },
        {
          key: "limitPurchases",
          name: "限购份数"
        },
        {
          key: "unitPrice",
          name: "单价"
        },
        {
          key: "cashReturn",
          name: "现金回报"
        },
        {
          key: "messageReturn",
          name: "消息回报"
        },
        {
          key: "exitMechanism",
          name: "退出机制"
        },
        {
          key: "lavePurchases",
          name: "剩余认购份数"
        },
        {
          key: "integral",
          name: "积分"
        },
        {
          key: "endDate",
          name: "结束时间"
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


