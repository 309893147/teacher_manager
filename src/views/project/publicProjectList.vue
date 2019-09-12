<template>
  <div>
    <List :header="tableHeader" :data="tableData" @page="getBanner" :page="pageInfo">
      <div slot="filters">
        <el-input v-model="filter.projectName" placeholder="项目名称" style="width:auto" clearable></el-input>
        <el-select v-model="filter.investmentTypeId">
          <el-option label="全部类型" :value="null"></el-option>
          <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="filter.projectStatus">
          <el-option label="全部状态" :value="null"></el-option>
          <el-option label="预告中" :value="0"></el-option>
          <el-option label="预约中" :value="1"></el-option>
          <el-option label="认购中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
        </el-select>
        <el-select v-model="filter.useType">
          <el-option label="全部发布状态" :value="null"></el-option>
          <el-option label="未发布" :value="0"></el-option>
          <el-option label="已经发布" :value="1"></el-option>
        </el-select>

        <el-button type="primary" @click="getBanner(1,10)">筛选</el-button>
      </div>

      <div slot="top-actions">
        <router-link :to="'/project/addProjectDetail'">
          <el-button type="primary">添加</el-button>
        </router-link>
        <!-- <el-button type="primary" @click="addDialog=true">添加</el-button> -->
      </div>

      <el-table-column slot="actions" label="操作" width="200">
        <template slot-scope="scope">
<!--          <router-link :to="'/project/updateProjectDetail?id='+scope.row.id">-->
<!--            <el-button>查看文件</el-button>-->
<!--          </router-link>-->
            <el-button type="primary" @click="jumpDetail(scope.row.id)">编辑</el-button>
            <el-button type="success" v-if="scope.row.useType === '未发布'" @click="release(scope.row.id)">发布</el-button>
        </template>
      </el-table-column>
    </List>
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
      addDialog: false,
      showReview: false,
      loading: false,
      listData: [],
      typeData: "",
      pageInfo: {},
      openDetailDialog: false,
      currentItem: {},
      filter: {
        projectName: null,
        approvalStatus: null,
        projectStatus: null,
        investmentTypeId: null,
        useType: null
      },
      page: {
        currentPage: null,
        pageSize: null
      }
    };
  },
  created() {
    this.getBanner();
    this.getProjectType();
  },
  watch: {
    addDialog(val) {
      if (!val) {
        this.currentItem = {};
      }
    }
  },
  methods: {
    release(val){
      let data={
        useType: '1',
        publicProjectId: val
      }
      this.ax.post('publicproject/update/usetype',data)
          .then(res =>{
              this.$message.success('发布成功')
              this.getBanner()
          })
    },
    jumpDetail(val){
      this.$router.push(
          {
            path: '/project/updateProjectDetail',
            query:{
              id: val
            }
          })
    },
    openDetail(item) {
      this.currentItem = item;
      this.openDetailDialog = true;
    },

    getProjectType() {
      let vm = this;
      this.ax
        .get("/investment/list")
        .then(it => {
          vm.typeData = it.dataList;
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },

    getBanner(page, size) {
      if (page == 0) {
        (page = null), (size = null);
      }
      let vm = this;
      this.ax
        .get("/publicproject/list", {
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
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    }
  },
  computed: {
    tableData() {
      let projectStatus = {
        0: "预告中",
        1: "预约中",
        2: "认购中",
        3: "已完成"
      };
// $GetTime freshRecommend
      let investmentSubject = {
        0: "个人",
        1: "公司"
      };

      let freshRecommend ={
        0 : '不是',
        1 : '是'
      }

      let useType ={
        0 : '未发布',
        1 : '已发布'
      }


      return this.listData.map(it => {
        it.subscriptionEndTime = this.$GetTime(it.subscriptionEndTime)
        it.projectStatus = projectStatus[it.projectStatus];
        it.investmentSubject = investmentSubject[it.investmentSubject];
        it.useType = useType[it.useType];
        it.freshRecommend = freshRecommend[it.freshRecommend];
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
          key: "projectDescription",
          name: "项目简介"
        },

        {
          key: "targetAmount",
          name: "目标金额"
        },
        {
          key: "startingAmount",
          name: "起投金额"
        },
        {
          key: "projectStatus",
          name: "项目状态"
        },
        {
          key: "investmentSubject",
          name: "投资主体"
        },
        {
          key: "investmentTypeName",
          name: "投资类型"
        },
        {
          key: "location",
          name: "位置"
        },
        {
          key: "detailedLocation",
          name: "详细地址"
        },
        // {
        //   key: "longitude",
        //   name: "经度"
        // },
        // {
        //   key: "latitude",
        //   name: "纬度"
        // },
        {
          key: "subscriptionEndTime",
          name: "结束时间"
        },
        {
          key: "attentionNumber",
          name: "关注人数"
        },
        {
          key: "freshRecommend",
          name: "是否最新推荐"
        },
        {
          key: "useType",
          name: "发布状态"
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


