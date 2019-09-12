<template>
  <div>
    <List :header="tableHeader" :data="tableData" @page="getBanner" :page="pageInfo">
      <el-table-column label="头像" slot="before">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.url" alt style="max-width:10em" />
        </template>
      </el-table-column>
      <div slot="top-actions" style="display: flex;align-items: center;justify-content: flex-end">
        <div style="display: flex;align-items: center;margin-right: 20px">
          <p>是否显示在前台页面展示：</p>
          <el-switch
              @change="openOrClose"
              v-model="teamStatusType"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </div>
        <el-button type="primary" @click="addDialog=true">添加</el-button>
      </div>

      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="editTeam(scope.row)" type="primary">编辑</el-button>
          <el-button
            type="danger"
            @click="openDeleteMode(scope.row)"
            slot="reference"
            :loading="scope.row.loading"
          >删除</el-button>
        </template>
      </el-table-column>
    </List>

    <el-dialog :visible.sync="addDialog" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="姓名：" label-width="6rem;">
          <el-input v-model="currentItem.name" placeholder></el-input>
        </el-form-item>
        <el-form-item label="职位：" label-width="6rem;">
          <el-input v-model="currentItem.position" placeholder></el-input>
        </el-form-item>
        <el-form-item label="简介：" label-width="6rem;">
          <el-input   type="textarea"
              :rows="4" v-model="currentItem.introduction" placeholder></el-input>
        </el-form-item>

        <el-form-item label="头像：">
          <ImageInput v-model="currentItem.url" url="/team/addPictureUrl"></ImageInput>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input type="number" value="0" v-model="currentItem.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button @click="addTeam" type="primary" :loading="loading">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showDelete">
      确认是否删除
      <div slot="footer">
        <el-button @click="cloneDeleteMode()">取消</el-button>
        <el-button @click="deleteTeam()" type="primary" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import List from "@/components/List";
import ImageInput from "@/components/ImageInput";

import qs from "qs";
export default {
  components: {
    List,
    ImageInput
  },
  props: ["publicProjectId",'teamStatus','teamId','teamList'],

  data() {
    return {
      showDelete: false,
      addDialog: false,
      showReview: false,
      loading: false,
      listData: [],
      pageInfo: {},
      openDetailDialog: false,
      currentItem: {},
      deleteList: "",
      teamStatusType:'',
    };
  },
  created() {
    this.getBanner();
    if(!this.teamStatus){
      this.teamStatusType = true
    } else {
      this.teamStatusType = false
    }
  },
  watch: {
    addDialog(val) {
      if (!val) {
        this.currentItem = {};
        this.currentItem.publicProjectId = this.publicProjectId;
      }
    },

    publicProjectId: function(res) {
      this.getBanner();
      //对项目id进行附值
      this.currentItem.publicProjectId = res;
    }
  },
  methods: {
    openOrClose(){
      if (!this.currentItem.id) {
        let statusData ={
          title: '发起团队',
          type: 3,
          pubProjectId: this.publicProjectId,
          status: this.teamStatusType?0:1,
        }
        this.ax.post('/publicproject/save/pubprojectshow',statusData)
            .then(res =>{
              this.$message.success('修改成功')
            })
      } else {
        let statusData ={
          status: this.teamStatusType?0:1,
          id: this.teamId,
        }
        this.ax.post('/publicproject/update/pubprojectshow',statusData)
            .then(res =>{
              this.$message.success('修改成功')
            })
      }

    },
    openDeleteMode(item) {
      this.deleteList = item;
      this.showDelete = true;
    },
    cloneDeleteMode() {
      this.showDelete = false;
    },
    cloneInput() {
      this.currentItem = "";
      this.addDialog = false;
    },

    deleteTeam() {
      let vm = this;
      vm.ax
        .post("/team/delete", this.deleteList)
        .then(it => {
          console.log(it);
          vm.success("删除成功");
          this.getBanner();
          this.cloneDeleteMode();
        })
        .catch(it => {
          vm.error(it);
        });
    },
    // openDetail(item) {
    //   this.currentItem = item;
    //   this.addDialog = true;
    // },
    editTeam(item) {
      this.currentItem = item;
      this.addDialog = true;
    },
    addTeam() {
      let vm = this;
      // let api=this.publicProjectId
      if (!vm.currentItem.id) {
        vm.ax
          .post("/team/save", vm.currentItem)
          .then(it => {
            vm.getBanner();
            vm.cloneInput();
            vm.newItem = {};
            vm.listData.forEach(item => {
              if (item.id == it.id) {
                Object.assign(item, it);
              }
              return true;
            });
            vm.$message.success("添加成功");
          })
          .catch(it => {
            vm.error(it);
          });
      } else {
        vm.ax
          .post("/team/update", vm.currentItem)
          .then(it => {
            vm.getBanner();
            vm.cloneInput();
            vm.newItem = {};
            vm.listData.forEach(item => {
              if (item.id == it.id) {
                Object.assign(item, it);
              }
              return true;
            });
            vm.$message.success("编辑成功");
          })
          .catch(it => {
            vm.error(it);
          });
      }
    },

  
    getBanner() {
      if (!this.publicProjectId) {
        return;
      }

      let vm = this;
      vm.currentItem.publicProjectId = this.publicProjectId;      
      this.ax
        .get("/team/list?publicProjectId="+  vm.currentItem.publicProjectId)
        .then(it => {
          console.log(it);
          vm.listData = it.dataList;
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    }
  },
  computed: {
    tableData() {
      return this.listData.map(it => {
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "name",
          name: "姓名"
        },
        {
          key: "position",
          name: "职位"
        },
        // {
        //   key: "url",
        //   name: "头像"
        // },

        {
          key: "introduction",
          name: "简介"
        },
        {
          key: "sort",
          name: "排序"
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


