<template>
  <div>
    <!-- <List :header="tableHeader" @page="getBanner" :data="tableData" :page="pageInfo"  :disableAction="true">
    </List>-->
    <List
      :header="tableHeader"
      @page="getList"
      :data="tableData"
      :page="pageInfo"
      :disableAction="true"
    >
      <div slot="filters">
        <el-input v-model="filter.userName" placeholder="名称" style="width:auto" clearable></el-input>

        <el-button type="primary" @click="getList(1,20)">筛选</el-button>
      </div>
    </List>

    <el-dialog title="反馈状态" :visible.sync="dialogVisible" width="30%">
      <el-select v-model="currentItem.status">
        <el-option label="未处理" value="UNPROCESSED"></el-option>
        <el-option label="已处理" value="PROCESSED"></el-option>
        <el-option label="误报" value="ARTIFICIAL"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit ">确 定</el-button>
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
  name: "feedbackList",
  data() {
    return {
      dialogVisible: false,
      loading: false,
      listData: [],
      pageInfo: {},
      filter: {
        userName: null,
      },
      currentItem: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    saveEdit() {
      let vm = this;
      vm.dialogVisible = false;
      let item = vm.currentItem;
      let payload = {
        id: item.id,
        status: item.status
      };
      this.ax
        .post("operation/feedback/edit", payload)
        .then(it => {
          vm.listData.forEach(item => {
            if (item.id == it.id) {
              Object.assign(item, it);
            }
          });
          vm.success("操作成功");
        })
        .catch(vm.OnError);
    },
    editFeedback(item) {
      this.currentItem = item;
      this.dialogVisible = true;
    },
    getList() {
      let vm = this;
      this.ax
        .get("/opinion/list", {
          params: {
            ...vm.filter
          }
        })
        .then(it => {
          vm.listData = it.dataList;
          vm.pageInfo = it;
        });
    }
  },
  computed: {
    tableData() {
      // let status = {
      //   UNPROCESSED: "未处理",
      //   PROCESSED: "已处理",
      //   ARTIFICIAL: "误报"
      // };

      let vm = this;
      return this.listData.map(it => {
        // it.statusName = status[it.status];
        return it;
      });
    },

    tableHeader() {
      let vm = this;
      return [
        {
          key: "userName",
          name: "反馈人"
        },
        {
          key: "createDate",
          name: "反馈时间"
        },
        {
          key: "remarks",
          name: "反馈内容"
        },
       
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


