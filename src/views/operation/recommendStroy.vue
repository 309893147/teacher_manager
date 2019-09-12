<template>
  <div>
    <List :header="tableHeader" :data="tableData" @page="getBanner" :page="pageInfo">
      <el-table-column label="摘要图片" slot="before">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.summaryUrl" alt style="max-width:10em" />
        </template>
      </el-table-column>
      <div slot="top-actions">
        <!-- <el-button type="primary" @click="setRecommendStory(scope.row)">添加</el-button> -->
        <el-button type="primary" @click="addDialog=true">添加</el-button>
      </div>

      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="editStory(scope.row)">编辑</el-button>
          <el-button type="danger" @click="openDeleteMode(scope.row)" slot="reference">删除</el-button>
        </template>
      </el-table-column>
    </List>

    <el-dialog :visible.sync="addDialog" :close-on-click-modal="false" v-if="addDialog">
      <el-form>
        <el-form-item label="标题：" label-width="6rem;">
          <el-input v-model="storyItem.title" placeholder="推荐故事标题"></el-input>
        </el-form-item>
        <el-form-item label="摘要：" label-width="6rem;">
          <el-input v-model="storyItem.summary" placeholder="推荐故事摘要"></el-input>
        </el-form-item>
        <el-form-item label="摘要图片：" label-width="6rem;">
          <ImageInput v-model="storyItem.summaryUrl" url="common/addPictureUrl"></ImageInput>
        </el-form-item>

        <text-editor v-model="storyItem.content"></text-editor>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button @click="saveRecommendStroy">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showDelete" width="200px">
      确认是否删除
      <div slot="footer">
        <el-button @click="cloneDeleteMode()">取消</el-button>
        <el-button @click="deleteTeam()" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import List from "@/components/List";
import TextEditor from "@/components/TextEditor";
import ImageInput from "@/components/ImageInput";

import qs from "qs";
export default {
  components: {
    List,
    TextEditor,
    ImageInput
  },
  data() {
    return {
      addDialog: false,
      showReview: false,
      listData: [],
      pageInfo: {},
      openDetailDialog: false,
      showDelete: false,
      storyItem: {},
      filter: {
        projectName: null
      },
      page: {
        currentPage: null,
        pageSize: null
      }
    };
  },
  created() {
    this.getBanner();
  },
  watch: {
    addDialog(val) {
      if (!val) {
        this.storyItem = {};
      }
    }
  },
  methods: {
    cloneInput() {
      this.storyItem = "";
      this.addDialog = false;
    },
    editStory(item) {
      this.storyItem = JSON.parse(JSON.stringify(item));
      this.addDialog = true;
    },

    openDeleteMode(item) {
      this.deleteList = JSON.parse(JSON.stringify(item));
      this.showDelete = true;
    },
    cloneDeleteMode() {
      this.showDelete = false;
    },

    deleteTeam() {
      let vm = this;
      console.log(this.deleteList.id);
      let data= {
        id : this.deleteList.id
      }

      vm.ax
        .post("webpage/delete", data)
        .then(it => {
          vm.success("删除成功");
          vm.currentItem = {};

          this.getBanner();
          this.cloneDeleteMode();
        })
        .catch(it => {
          vm.error(it);
        });
    },

    saveRecommendStroy() {
      let vm = this;
      //设置推荐故事 name
      vm.storyItem.name = "recommended_story";
      if (!vm.storyItem.id) {
        vm.ax
          .post("/webpage/save", vm.storyItem)
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
            vm.$message.success("操作成功");
          })
          .catch(it => {
            vm.error(it);
          });
      } else {
        vm.ax
          .post("/webpage/updatebyid", vm.storyItem)
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
            vm.$message.success("操作成功");
          })
          .catch(it => {
            vm.error(it);
          });
      }
    },

    getBanner(page, size) {
      if (page == 0) {
        (page = null), (size = null);
      }
      let vm = this;
      this.ax
        .get("/webpage/webpagelist", {
          params: {
            "page.currentPage": page,
            "page.pageSize": size,
            name: "recommended_story",
            ...this.filter
          }
        })
        .then(it => {
          vm.listData = it.dataList;
          delete it.dataList;
          vm.pageInfo = it.page;
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    }
  },
  computed: {
    tableData() {
      let brandStoryType = {
        0: "已选为推荐故事",
        1: "暂未选取"
      };

      return this.listData.map(it => {
        it.brandStoryType = brandStoryType[it.brandStoryType];
        return it;
      });
    },
    tableHeader() {
      return [
        {
          key: "title",
          name: "标题"
        },
        {
          key: "summary",
          name: "摘要"
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


