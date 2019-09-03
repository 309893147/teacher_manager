<template>
  <div>
    <div style="text-align:right;margin:10px 0">
      <el-button type="primary" @click="$router.go(-1)">返回</el-button>
    </div>

    <el-form>
      <el-form-item label="标题" label-width="80px">
        <el-input v-model="news.title"></el-input>
      </el-form-item>
      <!-- <el-form-item label="摘要" label-width="80px" v-if="hasSummary">
                    <el-input v-model="item.summary" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="封面" label-width="80px">
              <image-input v-model="item.cover"></image-input>
            </el-form-item>
            <el-form-item label="选择科目" v-if="needMajor()">
                    <el-select v-model="item.extraType" placeholder="选择科目">
                        <el-option :label="m.name" v-for="m in majorList" :key="m.id" :value="m.id"></el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="推荐人数" label-width="80px" v-if="needCourseExtra()">
                    <el-input v-model="item.recommendCount" placeholder="推荐人数"></el-input>
            </el-form-item>
            <el-form-item label="课程时长" label-width="80px" v-if="needCourseExtra()">
                    <el-input v-model="item.courseTime" placeholder="课程时长"></el-input>
      </el-form-item>-->
      <el-form-item label="正文" label-width="80px"></el-form-item>
    </el-form>
    <text-editor v-model="news.content" style="margin-left:80px"></text-editor>
    <div class="actions">
      <el-button type="primary" @click="addItem" :loading="loading">保存</el-button>
    </div>
  </div>
</template>
<script>
import ImageInput from "@/components/ImageInput";
import TextEditor from "@/components/TextEditor";
import Vue from "vue";
import { Message } from "element-ui";
import qs from "qs";
export default {
  components: {
    ImageInput,
    TextEditor,
    Message
  },
  data() {
    return {
      loading: false,
      news: {
        title: null,
        summary: null,
        headerImg: null,
        bannerImg: null,
        content: null
      },
      majorList: []
    };
  },
  created() {
    let id = this.$route.query.id;
    if (id) {
      this.getItemContent(id);
    }
  },
  methods: {
    getItemContent(id) {
      let vm = this;
      this.ax.get("media_text/" + id).then(it => {
        vm.news = it;
      });
    },
    addItem() {
      let item = this.news;
      let payload = {
        title: item.title,
        content: item.content
      };
      if (item.id) {
        payload.id = item.id;
      }
      let vm = this;
      vm.loading = true;
      this.ax
        .post("media_text", qs.stringify(payload))
        .then(it => {
          vm.loading = false;
          vm.news.id = it.id;
          Message({
            message: "保存成功",
            type: "success",
            duration: 2 * 1000
          });
        })
        .catch(it => {
          vm.loading = false;
        });
    }
  }
};
</script>
<style scoped>
.actions {
  text-align: right;
  margin: 10px;
}
</style>




