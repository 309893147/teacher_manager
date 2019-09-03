<template>
  <el-row>
    <el-tabs v-model="activeName" :before-leave="onTabSelcted">
      <el-tab-pane name="basic" label="项目信息">
        <el-form>
          <el-form-item label="项目名称：" label-width="6rem;">
            <el-input v-model="currentItem.projectName" placeholder></el-input>
          </el-form-item>
          <el-form-item label="项目简介：" label-width="6rem;">
            <el-input
              v-model="currentItem.projectDescription"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="目标金额：" label-width="6rem;">
            <el-input v-model="currentItem.targetAmount" placeholder></el-input>
          </el-form-item>
          <el-form-item label="起投金额：" label-width="6rem;">
            <el-input v-model="currentItem.startingAmount" placeholder></el-input>
          </el-form-item>
          <el-form-item label="地理位置：" label-width="6rem;">
            <el-input v-model="currentItem.location" placeholder="请输入准确地址,精确到省市"></el-input>
          </el-form-item>

          <el-form-item label="微信号：" label-width="6rem;">
            <el-input v-model="currentItem.weChatNumber" placeholder="请输入准确地址,精确到省市"></el-input>
          </el-form-item>

          <el-form-item label="认购结束时间: " label-width="6rem;">
            <el-date-picker
              v-model="currentItem.subscriptionEndTime"
              type="datetime"
              placeholder="认购结束时间"
              default-time="00:00:00"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="项目状态：" label-width="6rem;">
            <el-select v-model="currentItem.projectStatus" placeholder="请选择">
              <el-option label="预告中" :value="0"></el-option>
              <el-option label="预约中" :value="1"></el-option>
              <el-option label="认购中" :value="2"></el-option>
              <el-option label="已完成" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投资主体：" label-width="6rem;">
            <el-select v-model="currentItem.investmentSubject" placeholder="请选择">
              <el-option label="个人" :value="0"></el-option>
              <el-option label="公司" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投资类型：" label-width="6rem;">
            <el-select v-model="typeListName" placeholder="请选择" @change="valueId(typeListName)">
              <el-option
                v-for="(item,index) in typeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否模拟项目：" label-width="6rem;">
            <el-select v-model="currentItem.simulation" placeholder="请选择">
              <el-option label="不是" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-button type="primary" @click="updateProject">修改</el-button>
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane name="brandStory" label="品牌故事">
        <template v-if="activeName == 'brandStory'">
          <el-form>
            <text-editor v-model="currentItem.brandStory"></text-editor>
            <div class="saveBtn">
              <el-button type="primary" @click="updateBrandStory">保存</el-button>
            </div>
          </el-form>
        </template>
      </el-tab-pane>

      <el-tab-pane name="projectDetail" label="项目详情">
        <template v-if="activeName == 'projectDetail'">
          <el-form>
            <text-editor v-model="currentItem.projectDetail"></text-editor>
            <div class="saveBtn">
              <el-button type="primary" @click="updatePublicDetail">保存</el-button>
            </div>
          </el-form>
        </template>
      </el-tab-pane>

      <el-tab-pane name="publicPicture" label="图片展示">
        <PictureList :publicProjectId="publicProjectId"></PictureList>
      </el-tab-pane>

      <el-tab-pane name="initTeam" tab-click label="发起团队">
        <TeamList :publicProjectId="publicProjectId"></TeamList>
      </el-tab-pane>

      <el-tab-pane name="information" label="信息披露">
        <InformationList :publicProjectId="publicProjectId"></InformationList>
      </el-tab-pane>

      <el-tab-pane name="program" label="投资方案">
        <ProgramList :publicProjectId="publicProjectId"></ProgramList>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>
<script>
import qs from "qs";
import { Message } from "element-ui";
import TextEditor from "@/components/TextEditor";
import TeamList from "@/views/project/initiatingTeam";
import PictureList from "@/views/project/publicPicture";
import ProgramList from "@/views/project/investmentProgram";
import InformationList from "@/views/project/informationDisclosure";

import ImageInput from "@/components/ImageInput";

import List from "@/components/List";
export default {
  components: {
    TextEditor,
    ImageInput,
    Message,
    TeamList,
    List,
    PictureList,
    ProgramList,
    InformationList,
   
  },
  data() {
    return {
      textDialog: false,
      showFeeSetting: false,
      projectDetail: null,
      initiatingTeam: null,
      information: null,
      activeName: "basic",
      currentItem: {},
      pictureItem: {},
      detailItem: {},
      initTeam: {},
      storyItem: {},
      publicProjectId: null,
      data: {},
      fileList: [],

      typeList: {},
      addressUrl: null,
      locationItem: {},

      typeListName: '',  // 类型名
      projectId: '',  // 类型ID
      projectName: '',
    };
  },
  
  created() {
    this.publicProjectId = this.$route.query.id;
    this.getBanner()
    this.getInvestMentType();
  },
  methods: {
    getInvestMentType() {
      let vm = this;
      this.ax
        .get("/investment/list")
        .then(it => {
          vm.typeList = it.dataList;
          vm.typeList.forEach(res => {
            if(res.id === vm.projectId){
              vm.typeListName = res.name
            }
            
          });
          
          // vm.storyItem = it.brandStroy;
          // vm.detailItem = it.publicDetail;
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },

    getBanner() {
      let vm = this;
      this.ax
        .get("/publicproject/queryById", {
          params: {
            publicProjectId: this.publicProjectId
          }
        })
        .then(it => {
          vm.currentItem = it;
          vm.projectId = it.investmentTypeId
          
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },
    onTabSelcted(active, old) {
      if (active !== "basic" && !this.publicProjectId) {
        this.error("请先保存基本信息");
        return false;
      }
      return true;
    },
    editStory() {
      this.textDialog = true;
    },
    updateBrandStory() {
      let vm = this;
      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      vm.currentItem;
      vm.ax
        .post("/publicproject/updateBrandStory", vm.currentItem)
        .then(it => {
          vm.storyItem.publicProjectId = it;
          vm.success("编辑成功");
        })
        .catch(it => {
          vm.error(it);
        });
    },

    updatePublicDetail() {
      let vm = this;
      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      vm.ax
        .post("/publicproject/updatePublicDetail", vm.currentItem)
        .then(it => {
          vm.success("编辑成功");
        })
        .catch(it => {
          vm.error(it);
        });
    },

    valueId(val){
      this.projectId = val 
    },

    updateProject() {
      let vm = this;
      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      vm.currentItem.investmentTypeId = vm.projectId
      
      console.log(vm.currentItem);
      

      vm.ax
        .post("/publicproject/update", vm.currentItem)
        .then(it => {
          vm.success("编辑成功");
        })
        .catch(it => {
          vm.error(it);
        });
    },

    addTeam() {
      let vm = this;
      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      vm.ax
        .post("/team/add", vm.initTeam)
        .then(it => {
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
        .then(it => {})
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
.saveBtn{
  margin-top: 1.6rem;
}
/* /deep/.mce-panel {
  margin: 0 auto;
} */
</style>


