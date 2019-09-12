<template>
  <el-row>
    <el-tabs v-model="activeName">
      <el-tab-pane name="basic" label="项目信息">
        <el-form>
          <el-form-item label="项目名称：" label-width="6rem;">
            <el-input v-model="currentItem.projectName" placeholder></el-input>
          </el-form-item>
          <el-form-item label="项目简介：" label-width="6rem;">
            <el-input v-model="currentItem.projectDescription" placeholder></el-input>
          </el-form-item>
          <el-form-item label="目标金额：" label-width="6rem;">
            <el-input v-model="currentItem.targetAmount" placeholder></el-input>
          </el-form-item>
          <el-form-item label="起投金额：" label-width="6rem;">
            <el-input v-model="currentItem.startingAmount" placeholder></el-input>
          </el-form-item>
          <el-form-item label="项目状态：" label-width="6rem;">
            <el-input v-model="currentItem.projectStatus" placeholder></el-input>
          </el-form-item>
          <el-form-item label="投资主体：" label-width="6rem;">
            <el-input v-model="currentItem.investmentSubject" placeholder></el-input>
          </el-form-item>
          <el-form-item label="投资类型：" label-width="6rem;">
            <el-input v-model="currentItem.investmentTypeId" placeholder></el-input>
          </el-form-item>

          <el-form-item label="地理位置：" label-width="6rem;">
            <el-input v-model="currentItem.location" placeholder></el-input>
          </el-form-item>

          <el-form-item label="经度：" label-width="6rem;">
            <el-input v-model="currentItem.longitude" placeholder></el-input>
          </el-form-item>

          <el-form-item label="纬度：" label-width="6rem;">
            <el-input v-model="currentItem.latitude" placeholder></el-input>
          </el-form-item>

          <el-form-item label="认购剩余天数：" label-width="6rem;">
            <el-input v-model="currentItem.subscription" placeholder></el-input>
          </el-form-item>

          <!-- <el-form-item label="品牌故事：" label-width="6rem;"></el-form-item> -->
          <el-form-item label="品牌故事：" label-width="6rem;">
            <text-editor v-model="currentItem.brandStory"></text-editor>
          </el-form-item>

          <el-form-item label="项目详情：" label-width="6rem;">
            <text-editor v-model="currentItem.projectDetail"></text-editor>
            <!-- <TextEditor2 v-model="currentItem.projectDetail"></TextEditor2> -->
          </el-form-item>

          <div>
            <el-button type="primary" @click="addProject">保存</el-button>
          </div>
        </el-form>

        <el-form>
          <el-input type="hiden" v-model="pictureItem.publicProjectId"></el-input>

          <el-form-item label="图片上传">
            <ImageInput v-model="pictureItem.url" url="publicproject/addPictureUrl"></ImageInput>
       
          </el-form-item>
          <el-form-item label="排序">
            <el-input type="number" value="0" v-model="pictureItem.sort"></el-input>
          </el-form-item>
          <div>
            <el-button type="primary" @click="addPicture">添加</el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>
<script>
import qs from "qs";
import { Message } from "element-ui";
import TextEditor from "@/components/TextEditor";
import ImageInput from "@/components/ImageInput";
export default {
  components: {
    TextEditor,
    ImageInput,
    Message
  },
  data() {
    return {
      showFeeSetting: false,
      projectDetail: null,
      brandStory: null,
      initiatingTeam: null,
      information: null,
      activeName: "basic",
      currentItem: {},
      pictureItem: {},
      publicProjectId: null,
      data: {},
      fileList: []
    };
  },
  created() {
    this.publishProjectId = this.$route.query.id;
    this.getProjectDetail();
  },
  methods: {
     getProjectDetail() {
      let vm = this;
      this.ax
        .get("/publicproject/queryById?publishProjectId=" + this.publishProjectId)
        .then(it => {
          console.log(it);
          vm.projectDetail = it;
        })
        .catch(e => {
          console.log(e);
        });
    },

    // handlUpload(file) {
    //   console.log(file);
    //   let vm = this;
    //   let msg = null;
    //   if (msg !== null) {
    //     this.error(msg);
    //     return;
    //   }

    //   vm.ax
    //     .post("/publicproject/addPictureUrl", file)
    //     .then(it => {
    //       console.log(it);
    //     })
    //     .catch(it => {
    //       vm.error(it);
    //     });
    // },
    
    addProject() {
      let vm = this;
      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      vm.ax
        .post("/publicproject/add", vm.currentItem)
        .then(it => {
          vm.pictureItem.publicProjectId = it;
          vm.success("添加成功");
        })
        .catch(it => {
          vm.error(it);
        });
    },
    addPicture() {
      let vm = this;
      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      vm.ax
        .post("/publicproject/addPicture", vm.pictureItem)
        .then(it => {
          console.log(it);
        })
        .catch(it => {
          vm.error(it);
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
text-editor {
  padding-left: 1.6rem;
}
/deep/.mce-panel {
  margin: 0 auto;
}
</style>


