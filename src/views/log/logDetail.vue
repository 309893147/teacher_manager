<template>
  <el-dialog :visible.sync="show" title="详情" @close="$emit('close')">
    <el-tabs v-model="activeName" v-if="detail">
      <el-tab-pane name="log" label="日志信息" v-if="detail.log">
        <el-row v-if="detail && detail.log">
          <el-col class="section">基本信息</el-col>
          <infoItem title="时间" :content="detail.log.createTime"></infoItem>
          <infoItem title="类型" :content="detail.log.types"></infoItem>
          <infoItem title="内容" :content="detail.log.content"></infoItem>
          <infoItem title="反馈码" :content="detail.log.code"></infoItem>

          <el-col class="section">机器信息</el-col>
          <infoItem title="机器编号" :content="detail.store.id"></infoItem>
          <!-- <infoItem title="机器地址" :content="detail.store.address"></infoItem> -->
        </el-row>

        <div class="v-padding">
          机器地址：
          <a
            v-bind:href="'https://www.google.com/maps/search/?api=1&query='+detail.store.latitude+','+detail.store.longitude"
            target="_blank"
          >{{detail.store.address}}</a>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import infoItem from "./infoItem.vue";
export default {
  components: {
    infoItem
  },
  props: ["open", "id"],
  data() {
    return {
      activeName: "log",
      show: false,
      detail: null
    };
  },

  methods: {
    onLog(it) {
      let types = {
        RUN: "运行",
        OPERATION: "操作"
      };
      it.log.types = types[it.log.type];
    },
    getDetail() {
      let url = "log/" + this.id;
      let vm = this;
      vm.startLoading();
      this.ax
        .get(url)
        .then(it => {
          vm.stopLoading();
          vm.onLog(it);
          vm.detail = it;
        })
        .catch(it => {
          vm.stopLoading();
          vm.error(it);
        });
    }
  },
  watch: {
    bargainId(val) {
      if (val) {
        this.getDetail();
      }
    },
    id(val) {
      if (val) {
        this.getDetail();
      }
    },
    open(val) {
      this.show = val;
    },
    show(val) {
      if (!val) {
      }
    }
  }
};
</script>
<style scoped>
.section {
  border-left: solid 5px #409eff;
  color: #409eff;
  padding: 0rem 0.2rem;
  margin: 0.4rem 0;
}

.v-padding {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  color: #bbb;
}
.v-padding a {
  color: #1f2d3d;
}
</style>


