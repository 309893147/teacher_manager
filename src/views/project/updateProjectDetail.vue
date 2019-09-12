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
          <!--
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
          -->

          <el-form-item label="地理位置：" label-width="6rem;">
            <el-input v-model="location" @focus="openMap()" placeholder="请输入准确地址,精确到省市"></el-input>
          </el-form-item>

          <LocationPicker :value="mapValue" :show="mapShow" @input="mapValueInput" @close="closeMap" ref="mapLocation"></LocationPicker>

          <el-form-item label="项目周边：" label-width="6rem;">
            <el-input v-model="currentItem.aroundProject" placeholder="请输入准确地址,精确到省市"></el-input>
          </el-form-item>

          <!--
          <el-form-item label="结束时间: " label-width="6rem;">
            <el-date-picker
              v-model="currentItem.subscriptionEndTime"
              type="datetime"
              placeholder="认购结束时间"
              default-time="00:00:00"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          -->
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
          <el-form-item label="是否最新推荐：" label-width="6rem;">
            <el-select v-model="currentItem.freshRecommend" placeholder="请选择">
              <el-option label="不是" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <div style="display: flex;align-items: center">
            <el-button type="primary" @click="updateProject">修改</el-button>
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane name="brandStory" label="品牌故事">
        <template v-if="activeName == 'brandStory'">
          <el-form>
            <text-editor v-model="currentItem.brandStory"></text-editor>
            <div class="saveBtn" style="display: flex;align-items: center">
              <el-button type="primary" @click="updateBrandStory">保存</el-button>

              <div style="display: flex;align-items: center;margin-left: 20px">
                <p>是否显示在前台页面展示：</p>
                <el-switch
                    v-model="brandStoryStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </div>
            </div>
          </el-form>
        </template>
      </el-tab-pane>

      <el-tab-pane name="projectDetail" label="项目详情">
        <template v-if="activeName == 'projectDetail'">
          <el-form>
            <text-editor v-model="currentItem.projectDetail"></text-editor>
            <div class="saveBtn" style="display: flex;align-items: center">
              <el-button type="primary" @click="updatePublicDetail">保存</el-button>
              <div style="display: flex;align-items: center;margin-left: 20px">
                <p>是否显示在前台页面展示：</p>
                <el-switch
                    v-model="projectStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </div>
            </div>
          </el-form>
        </template>
      </el-tab-pane>

      <el-tab-pane name="publicPicture" label="图片展示">
        <PictureList :publicProjectId="publicProjectId"></PictureList>
      </el-tab-pane>

      <el-tab-pane name="initTeam" tab-click label="发起团队">
        <TeamList :teamStatus="teamStatus" :teamId="teamId" :teamList="teamList" :publicProjectId="publicProjectId"></TeamList>
      </el-tab-pane>

      <el-tab-pane name="information" label="信息披露">
        <InformationList :infoStatus="infoStatus" :infoId="infoId" :infoList="infoList" :publicProjectId="publicProjectId"></InformationList>
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
    'LocationPicker':() => import('@/components/LocationPicker')

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

      typeList: {},
      addressUrl: null,
      locationItem: {},

      typeListName: '',  // 类型名
      projectId: '',  // 类型ID
      projectName: '',

      mapLat: '',
      mapLng: '',

      mapShow: false,
      location: '',

      mapValue:{
        lat: '',
        lng: ''
      },

      brandStoryStatus: '', // 品牌故事
      brandStoryId: '',  // id
      projectStatus: '', // 项目详情状态
      projectStatusId: '',
      teamStatus: '', // 发起团队
      teamList: '',
      teamId: '',
      infoStatus: '', // 信息披露
      infoId: '',
      infoList: '',
    };
  },

  created() {
    this.publicProjectId = this.$route.query.id;
    this.getBanner()
    this.getInvestMentType();
    this.getProvinceData();
    this.getShowType()
  },
  methods: {
    getShowType(){
      let data={
        pubProjectId: this.publicProjectId
      }
      this.ax.get('/publicproject/getlist',{params: data})
          .then(res =>{
            res.dataList.map(item =>{
              if(item.type === 1){ // 品牌故事
                this.brandStoryId = item.id
                this.brandStoryStatus = item.status === 0? true: false
              } else if(item.type === 2){ // 项目详情
                this.projectStatusId = item.id
                this.projectStatus = item.status === 0? true: false
              } else if(item.type === 3){ // 发起团队
                this.teamList = item
                this.teamId = item.id
                this.teamStatus = item.status === 0? true: false
              } else if(item.type === 4){ // 信息披露
                this.infoList = item
                this.infoId = item.id
                this.infoStatus = item.status === 0? true: false
              }
            })
          })
    },

    // 打开地图
    openMap(){
      this.mapShow = true
    },
    mapValueInput(val){
      let data = JSON.parse(JSON.stringify(val))
      this.mapLat = data.lat;
      this.mapLng = data.lng
      this.location = data.lat + ',' + data.lng
      this.mapShow = false
    },
    closeMap(){
      this.mapShow = false
    },


    getInvestMentType() {
      let vm = this;
      this.ax
        .get("/investment/list")
        .then(it => {
          console.log(it);
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
          vm.location = vm.currentItem.longitude+ ','+vm.currentItem.latitude
          vm.mapValue.lng = vm.currentItem.longitude
          vm.mapValue.lat = vm.currentItem.latitude
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
      let statusData ={
        status: this.brandStoryStatus?0:1,
        id: this.brandStoryId,
      }
      this.ax.post('/publicproject/update/pubprojectshow',statusData)
          .then(res =>{

          })
      let vm = this;
      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      vm.currentItem.latitude = this.mapLat;
      vm.currentItem.longitude = this.mapLng;
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
      let statusData ={
        status: this.projectStatus?0:1,
        id: this.projectStatusId,
      }
      this.ax.post('/publicproject/update/pubprojectshow',statusData)
          .then(res =>{

          })
      let vm = this;
      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      vm.currentItem.latitude = this.mapLat;
      vm.currentItem.longitude = this.mapLng;
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
      if(this.location){
        this.currentItem.latitude = this.mapLat;
        this.currentItem.longitude = this.mapLng;
      }
      if(this.province && this.city && this.district){
        this.currentItem["location"] = this.province+this.city+this.district;
      }

      let vm = this;
      let msg = null;
      if (msg !== null) {
        this.error(msg);
        return;
      }
      vm.currentItem.investmentTypeId = vm.projectId
      this.currentItem.latitude = this.mapLat;
      this.currentItem.longitude = this.mapLng;
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


