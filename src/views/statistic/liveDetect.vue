<template>
  <div>
    <List
      :data="tableData"
      :header="tableHeader"
      @page="getList"
      :page="pageInfo"
      :loading="loading"
      :disableAction="true"
    >
      <el-table-column label="人像" slot="before">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.image" alt style="max-width:10em">
        </template>
      </el-table-column>
      <el-table-column slot="actions" label="操作">
        <template slot-scope="scope">
          <el-button @click="showVideo(scope.row.video)">查看视频</el-button>
        </template>
      </el-table-column>
      <div slot="filters">
        <el-select v-model="filter.status">
          <el-option label="全部状态" :value="null"></el-option>
          <el-option label="未检测" :value="0"></el-option>
          <el-option label="通过" :value="1"></el-option>
          <el-option label="未通过" :value="2"></el-option>
        </el-select>
        <el-date-picker
          v-model="filter.startTime"
          type="datetime"
          placeholder="开始时间"
          value-format="timestamp"
        ></el-date-picker>
        <el-date-picker
          v-model="filter.endTime"
          type="datetime"
          placeholder="结束时间"
          value-format="timestamp"
        ></el-date-picker>
        <el-button type="primary" @click="getList(0,20)" :loading="loading">筛选</el-button>
      </div>
      <!-- <el-card shadow="never" v-if="!loading" style="width: 100%" slot="statistic">
        <div v-if="pageInfo.extra.status != null">
          状态:
          <span v-if="pageInfo.extra.status === 0">未请求</span>
          <span v-if="pageInfo.extra.status === 1">验证失败</span>
          <span v-if="pageInfo.extra.status === 2">验证成功</span>
        </div>
        <div v-if="pageInfo.extra.startTime">开始时间:{{formatTime(pageInfo.extra.startTime)}}</div>
        <div v-if="pageInfo.extra.endTime">结束时间: {{formatTime(pageInfo.extra.endTime)}}</div>
        <div>总数:{{pageInfo.totalElements}}</div>
      </el-card>-->
    </List>
    <el-dialog :visible.sync="showDialog" title="活体视频">
      <video v-bind:src="video" controls></video>
    </el-dialog>
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
      showDialog: false,
      video: null,
      list: [],
      currentItem: null,
      page: 0,
      filter: {
        startTime: null,
        endTime: null,
        status: null
      },
      loading: false,
      pageInfo: { loading: false }
    };
  },
  created() {
    this.userId = this.$route.query.user;
    this.getList();
  },
  computed: {
    tableData() {
      return this.list.map(it => {
        it.statusName = this.getLiveDetectStatusName(it.status);
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "errorMsg",
          name: "结果"
        },
        {
          key: "statusName",
          name: "状态"
        },
        {
          key: "compare",
          name: "相似度"
        },
        {
          key: "requestId",
          name: "请求序号"
        },
        {
          key: "updateTime",
          name: "完成时间"
        },
        {
          key: "createTime",
          name: "创建时间"
        }
      ];
    }
  },
  methods: {
    showVideo(video) {
      this.showDialog = true;
      this.video = video;
    },
    getLiveDetectStatusName(status) {
      let statusMap = { 0: "未检测", 1: "通过", 2: "未通过" };
      return statusMap[status];
    },
    formatTime(time) {
      let date = new Date(time);

      return (
        [
          date.getFullYear(),
          this.appendZero(date.getMonth() + 1),
          this.appendZero(date.getDate())
        ].join("-") +
        " " +
        [
          this.appendZero(date.getHours()),
          this.appendZero(date.getMinutes()),
          this.appendZero(date.getSeconds())
        ].join(":")
      );
    },
    appendZero(num) {
      if (num < 10) {
        return "0" + num;
      }
      return num;
    },
    getTypeName(status) {
      let statusMap = { 0: "未请求", 1: "验证失败", 2: "验证成功" };
      return statusMap[status];
    },
    getStatusName(status) {
      let statusMap = {
        0: "未请求",
        1: "验证失败",
        2: "验证成功"
      };
      let statusName = statusMap[status];
      return statusName;
    },
    getList(page, size) {
      let vm = this;
      this.loading = true;
      this.ax("statistic/live", {
        params: {
          page: page,
          size: size,
          status: this.filter.status,
          startTime: this.filter.startTime,
          endTime: this.filter.endTime
        }
      })
        .then(data => {
          vm.loading = false;
          vm.list = data.content;
          delete data.content;
          vm.pageInfo = data;
          vm.pageInfo.loading = false;
        })
        .catch(it => {
          vm.loading = false;
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
