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

          <el-form-item label="微信号：" label-width="6rem;">
            <el-input v-model="currentItem.weChatNumber" placeholder="请输入准确地址,精确到省市"></el-input>
          </el-form-item>

          <el-form-item label="城市：" label-width="6rem;">
            <el-select v-model="province" placeholder="请选择" @change="getCity(province)">
              <el-option
                v-for="(item,index) in provinceData"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>

            <el-select v-model="city" placeholder="请选择" @change="getDistrict(city)">
              <el-option
                v-for="(item,index) in cityData"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>

            <el-select v-model="district" placeholder="请选择">
              <el-option
                v-for="(item,index) in districtData"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="地理位置：" label-width="6rem;">
            <el-input v-model="currentItem.location" placeholder="请输入准确地址,精确到省市"></el-input>
          </el-form-item>

          <el-form-item label="项目周边：" label-width="6rem;">
            <el-input v-model="currentItem.aroundProject" placeholder="请输入准确地址,精确到省市"></el-input>
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
            <el-select v-model="currentItem.investmentTypeId" placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.id"
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
            <el-button type="primary" @click="addProject">保存</el-button>
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane name="brandStory" label="品牌故事">
        <template v-if="activeName == 'brandStory'">
          <el-form>
            <text-editor v-model="storyItem.brandStory"></text-editor>

            <div class="saveBtn">
              <el-button type="primary" @click="updateBrandStory">保存</el-button>
            </div>
          </el-form>
        </template>
      </el-tab-pane>

      <el-tab-pane name="projectDetail" label="项目详情">
        <template v-if="activeName == 'projectDetail'">
          <el-form>
            <text-editor v-model="detailItem.projectDetail"></text-editor>
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

    <el-dialog :visible.sync="textDialog" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="类型">
          <text-editor v-model="detailItem.id"></text-editor>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="textDialog = false">取消</el-button>
        <el-button @click="updateBrandStory" type="primary">保存</el-button>
      </div>
    </el-dialog>
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
//  import city from '@/utils/city/city.json';
import citys from "@/utils/city/city.json";

import ImageInput from "@/components/ImageInput";

import List from "@/components/List";
import Vue from "vue";
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
    citys
  },
  data() {
    return {
      province: "", // 省份
      provinceData: "", // 省份列表

      city: "", // 城市
      cityData: "", // 城市列表

      district: "", // 区县
      districtData: "", // 区县列表

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
      //下拉选择框的项目类型表单
      typeList: {},
      addressUrl: null,
      locationItem: {}
    };
  },

  created() {
    this.getInvestMentType();
    this.getProvinceData();
  },
  methods: {
    getProvinceData() {
      this.$axios.get("/static/mock/city/city.json").then(res => {
        this.provinceData = res.data;
      });
    },

    // 获取城市
    getCity(val) {
      this.city = "";
      this.district = "";
      this.provinceData.forEach(res => {
        if (res.name === val) {
          this.cityData = res.child;
        }
      });
    },

    // 获取区县
    getDistrict(val) {
      this.district = "";
      this.cityData.forEach(res => {
        if (res.name === val) {
          this.districtData = res.child;
        }
      });

      console.log(this.districtData);
    },

    getInvestMentType() {
      let vm = this;
      this.ax
        .get("/investment/list")
        .then(it => {
          vm.typeList = it.dataList;
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
      vm.ax
        .post("/publicproject/updateBrandStory", vm.storyItem)
        .then(it => {
          vm.storyItem.publicProjectId = it;
          vm.success("添加成功");
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
        .post("/publicproject/updatePublicDetail", vm.detailItem)
        .then(it => {
          vm.success("添加成功");
        })
        .catch(it => {
          vm.error(it);
        });
    },

    addProject() {
      let vm = this;

      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      if (!this.validProject(vm.currentItem)) {
        return;
      }

      let url =
        "https://restapi.amap.com/v3/geocode/geo?key=a8f03b157ea2eb6c2c40d10041cf48f7&address=" +
        vm.currentItem.location;
      this.$axios
        .get(url)
        .then(res => {
          let geoLocation = res.data.geocodes[0].location.split(",");
          let lon = geoLocation[0];
          let lat = geoLocation[1];
          vm.currentItem.latitude = lat;
          vm.currentItem.longitude = lon;

          vm.currentItem.detailedLocation = vm.province
            .concat(vm.city)
            .concat(vm.district);
          vm.ax
            .post("/publicproject/add", vm.currentItem)
            .then(it => {
              vm.publicProjectId = it;
              vm.success("添加成功");
            })
            .catch(it => {
              vm.error(it);
            });
        })
        .catch((err = {}));
    },
    validProject(currentItem) {
      let msg = null;
      if (!currentItem.projectName) {
        msg = "请输入项目名称";
      }
      if (!currentItem.projectDescription) {
        msg = "请输入项目简介";
      }
      if (!currentItem.targetAmount) {
        msg = "请输入目标金额";
      }
      if (!currentItem.startingAmount) {
        msg = "请输入起投金额";
      }
      if (!currentItem.weChatNumber) {
        msg = "请输入微信号";
      }
      if (!currentItem.location) {
        msg = "请输入地理位置";
      }
      // if (!currentItem.detailedLocation) {
      //   msg = "请选择项目状态";
      // }
      // if (!currentItem.projectStatus) {
      //   msg = "请选择项目状态";
      // }
      // if (!currentItem.investmentSubject) {
      //   msg = "请选择投资主体";
      // }
      // if (!currentItem.investmentTypeId) {
      //   msg = "请选择投资类型";
      // }
      // if (!currentItem.investmentTypeId) {
      //   msg = "请选择项目是否为模拟项目";
      // }
      if (msg) {
        this.error(msg);
        return false;
      }
      return true;
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
.saveBtn {
  margin-top: 1.6rem;
}
/* /deep/.mce-panel {
  margin: 0 auto;
} */
</style>


