<template>
  <el-row>
    <el-row v-if="projectDetail">
      <el-col class="v-padding">{{projectDetail.company}}</el-col>
    </el-row>
    <el-tabs v-model="activeName" v-if="projectDetail">
      <el-tab-pane name="basic" label="项目详情">
        <div class="v-padding">公司名称：{{projectDetail.company}}</div>
        <div class="v-padding">估值：{{projectDetail.valuation}}</div>
        <div class="v-padding">筹集规模：{{projectDetail.raiseScale}}</div>
        <div class="v-padding">筹集模式: {{projectDetail.rasingMode}}</div>
        <div class="v-padding">起投金额：{{projectDetail.startingAmount}}</div>
        <div class="v-padding">每人限投：{{projectDetail.limitedPerPerson}}</div>
        <div class="v-padding">提前退出窗口区：{{projectDetail.exitWindow}}</div>
        <div class="v-padding">交易结构图：{{projectDetail.url}}</div>
        <div class="v-padding">项目特色：{{projectDetail.programFeatures}}</div>
      </el-tab-pane>
      <!-- <el-tab-pane name="brand" label="品牌故事">
        <div class="v-padding">描述：{{brandStory.description}}</div>
        <div class="v-padding">图片：{{brandStory.url}}</div>
      </el-tab-pane>-->


      <el-tab-pane name="team" label="发起团队">
        <div v-for="(item,index) in initiatingTeam" :key="index">
          <span>
            <img
              v-bind:src="item.url"
              alt
              style="height:50px;width:50px;border: 5px solid #dedede;
-moz-border-radius: 15px;
-webkit-border-radius: 15px;
border-radius:15px; "
            />
          </span>
          <div class="v-padding">名称：{{item.name}}</div>
          <div class="v-padding">职位：{{item.position}}</div>
          <div class="v-padding">简介：{{item.introduction}}</div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="information" label="信息披露">
        <div v-for="(item,index) in information" :key="index">
          文件:
          <div class="v-padding">{{item.createTime}}</div>

          <div @click="fileClick" >{{item.file}}</div>
          <router-link class="v-padding" :to="item.file">{{item.file}}</router-link>

          <pdf :src="src">{{item.file}}</pdf>
          <div class="v-padding">是否仅投资人可见：{{item.hideType}}</div>
        </div>
      </el-tab-pane> 
    </el-tabs>
  </el-row>
</template>
<script>
// import ItemList from "@/views/item/itemList";
import qs from "qs";
export default {
  components: {
    },
  data() {
    return {
      id: null,
      showFeeSetting: false,
      orderDetail: null,
      brandStory: null,
      initiatingTeam: null,
      information: null,
      activeName: "basic",
      data: {},
      src: 'file:///C:/Users/Administrator/Documents/WeChat%20Files/mezhiails1314/FileStorage/File/2019-08/智慧访客功能清单.pdf',
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getOrderDetail();
    // this.getBrandStory();
    this.getInitiatingTeam();
    this.getInformation();
    // this.src = pdf.createLoadingTask(this.src)
  },
  methods: {
    getOrderDetail() {
      let vm = this;
      this.ax
        .get("/order/detail/list?id=" + this.id)
        .then(it => {
          vm.orderDetail = it;
                    console.log(vm.orderDetail);
        })
        .catch(e => {
          console.log(e);
        });
    },

    // getBrandStory() {
    //   let vm = this;
    //   this.ax
    //     .get("/brandstory/list?publishProjectId=" + this.publishProjectId)
    //     .then(it => {
    //       console.log(it);
    //       vm.brandStory = it;
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },

    getInitiatingTeam() {
      let vm = this;
      this.ax
        .get("/team/list?publishProjectId=" + this.publishProjectId)
        .then(it => {
          console.log(it);
          vm.initiatingTeam = it.dataList;
          console.log(vm.initiatingTeam);
        })
        .catch(e => {
          console.log(e);
        });
    },

    getInformation() {
      let vm = this;
      this.ax
        .get("/information/list?publishProjectId=" + this.publishProjectId)
        .then(it => {
          vm.information = it.dataList;
        })
        .catch(e => {
          console.log(e);
        });
    },
    fileClick(){
//       let urls = 'file:///C:/Users/Administrator/Documents/WeChat%20Files/mezhiails1314/FileStorage/File/2019-08/智慧访客功能清单.pdf'
// window.open(urls, '_blank');
window.location.href ='file:///C:/Users/Administrator/Documents/WeChat%20Files/mezhiails1314/FileStorage/File/2019-08/智慧访客功能清单.pdf';
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


