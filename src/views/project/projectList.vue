<template>
  <div>
    <List :header="tableHeader" @page="getBanner" :data="tableData" :page="pageInfo">
      <div slot="filters">
        <el-input v-model="filter.projectName" placeholder="项目名称" style="width:auto" clearable></el-input>
        <el-select v-model="filter.projectAvailable">
          <el-option label="全部状态" :value="null"></el-option>
          <el-option label="未审核" :value="0"></el-option>
          <el-option label="已通过" :value="1"></el-option>
          <el-option label="已驳回" :value="2"></el-option>
        </el-select>

        <el-select v-model="filter.projectSchedule">
          <el-option label="全部进度" :value="null"></el-option>
          <el-option label="考察" :value="0"></el-option>
          <el-option label="已投资" :value="1"></el-option>
          <el-option label="待投资" :value="2"></el-option>
          <el-option label="预投资" :value="3"></el-option>
          <el-option label="完成" :value="4"></el-option>
        </el-select>

        <el-select v-model="filter.projectTypeId">
          <el-option label="全部类型" :value="null"></el-option>
          <el-option
            v-for="(item , index) in projecttype"
            :label="item.name"
            :key="index"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-button class="getBannerBtn" type="primary" @click="getBanner(1,20)">筛选</el-button>
      </div>

      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.projectAvailable === '未通过'" @click="reviewPublish(scope.row.id,'1',scope.$index)">通过</el-button>
          <el-button type="danger" v-if="scope.row.projectAvailable === '审核通过' || scope.row.projectAvailable === '未审核'" @click="reviewPublish(scope.row.id,'2',scope.$index)">驳回</el-button>
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
  props: ["type", "filterProperty", "filterId"],
  data() {
    return {
      addDialog: false,
      showReview: false,
      name: "",
      loading: false,
      projecttype: "",
      listData: [],
      pageInfo: {},
      areas: [],
      openDetailDialog: false,
      currentItem: {},
      reviewStatus: null,
      filter: {
        projectAvailable: null,
        projectSchedule: null,
        projectTypeId: null,
        projectType: []
      },
      currentCity: null,
      extraData: null
    };
  },
  created() {
    this.getProjectType();
  },
  watch: {},
  methods: {
    openDetail(item) {
      this.currentItem = item;
      this.openDetailDialog = true;
    },
    getBanner(page, size) {
      let vm = this;
      this.ax
        .get("project/list", {
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
    },
    getProjectType() {
      let vm = this;
      this.ax.get("project/type").then(it => {
        vm.projecttype = it.dataList;
      });
    },

    reviewPublish(projectId, projectAvailable, index, reason) {
      let newProject = {};
      let vm = this;

      if (projectAvailable === "2" && !reason) {
        this.$prompt("请输入原因", "拒绝原因").then(it => {
          let bb = it.value;
          if (!bb) {
            return;
          }

          vm.reviewPublish(projectId, projectAvailable, index, bb);
        });
        return;
      }
      if (reason) {
        let msg = newProject.msg;
        if (!msg) {
          msg = "";
        }
        newProject.msg = reason;
      } else {
        newProject.msg = reason;
      }
      newProject.projectId = projectId;
      newProject.projectAvailable = projectAvailable;
      this.ax
        .post("project/dealwith", newProject)
        .then(it => {
          vm.$forceUpdate();
          vm.success("操作成功");
          this.getBanner();
        })
        .catch(vm.OnError);
    }
  },
  computed: {
    tableData() {
      let projectAvailable = {
        0: "未审核",
        1: "审核通过",
        2: "未通过"
      };

      let projectSchedule = {
        0: "考察",
        1: "已投资",
        2: "待投资",
        3: "预投资",
        4: "完成"
      };

      return this.listData.map(it => {
        it.projectAvailable = projectAvailable[it.projectAvailable];
        it.projectSchedule = projectSchedule[it.projectSchedule];
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "projectName",
          name: "项目名称"
        },
        {
          key: "name",
          name: "投资类型"
        },
        {
          key: "contact",
          name: "联系人"
        },

        {
          key: "contactPhone",
          name: "联系电话"
        },

        {
          key: "location",
          name: "地理位置"
        },
        {
          key: "projectSchedule",
          name: "项目进度"
        },
        {
          key: "planTotalMoney",
          name: "拟总融资金额"
        },
        {
          key: "projectIntroduction",
          name: "项目介绍"
        },
        {
          key: "projectAvailable",
          name: "项目状态"
        },
        {
          key: "msg",
          name: "处理意见"
        }
      ];
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  /deep/.top-filters{
    >div{
      display: flex;
      align-items: center;
      .el-select{
        margin-left: 15px;
      }
      .getBannerBtn{
        margin: 0 0 0 15px;
      }
    }
  }
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


