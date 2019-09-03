<template>
  <el-row>
    <el-row v-if="feedback">
      <el-col class="v-padding">{{feedback.name}}</el-col>
    </el-row>
    <el-tabs v-model="activeName" v-if="feedback">
      <el-tab-pane name="basic" label="基本信息">
        <div class="v-padding">：{{feedback.name}}</div>
        <div class="v-padding">机器编号：{{feedback.extra}}</div>
        <div class="v-padding">反馈人：{{feedback.username}}</div>
        <div class="v-padding">反馈类型：{{feedback.typeName}}</div>
        <div class="v-padding">反馈状态：{{feedback.statusName}}</div>
        <div class="v-padding">联系方式：{{feedback.contact}}</div>
        <div class="v-padding">
          反馈图片：
          <span>
            <img v-bind:src="feedback.images" alt style="height:100%;width:100%" />
          </span>
        </div>
      </el-tab-pane>

      <el-tab-pane name="setting" label="维护">
        <el-form>
          <el-form-item label="状态" label-width="6rem">
            <el-select v-model="feedback.status">
              <el-option value="MAINTAIN" label="维护中"></el-option>
              <el-option value="FAULT" label="正常"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="联系电话" label-width="6rem">
            <el-input placeholder="联系电话" v-model="infoSettings.contact"></el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="saveFeemethod" type="primary">保存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>
<script>
import FeedbackList from "@/views/operation/feedback";
import qs from "qs";
export default {
  components: {
    FeedbackList
  },
  data() {
    return {
      feedbackId: null,
      showFeeSetting: false,
      feedback: {},
      activeName: "basic",
      infoSettings: {},
      data: {},
      activeOrderTab: "all"
    };
  },
  created() {
    this.feedbackId = this.$route.query.id;
    this.getFeedbackDetail();
    let vm = this;
  },
  methods: {
    saveFeemethod() {
      let vm = this;
      this.startLoading();
      this.ax
        .post("feedback/" + this.feedbackId + "/setting", this.infoSettings)
        .then(it => {
          vm.stopLoading();
          vm.success("设置成功");
          vm.onFeedback(it);
        })
        .catch(e => {
          vm.stopLoading();
        });
    },
    onFeedback(it) {
      let status = {
        UNPROCESSED: "未处理",
        FAULT: "故障",
        USING: "正常"
      };
      let types = {
        FEATURE: "功能建议",
        BUG: "BUG反馈"
      };

      this.infoSettings = Object.assign({}, this.infoSettings, it.info);
      it.state = status[it.status];
      it.fbtype = types[it.type];
      this.feedback = it;
    },
    getFeedbackDetail() {
      let vm = this;
      this.ax
        .get("operation/" + this.feedbackId)
        .then(it => {
          vm.onFeedback(it);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
<style scoped>
.flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.v-padding {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
}
.h-padding {
  padding-left: 0.6rem;
  padding-right: 0.6rem;
}
.el-input {
  width: auto;
}
</style>


