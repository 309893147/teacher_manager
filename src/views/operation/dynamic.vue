<template>
  <div>
    <List :header="tableHeader" :data="tableData" @page="getBanner" :page="pageInfo">
<!--      <el-table-column label="摘要图片" slot="before">-->
<!--        <template slot-scope="scope">-->
<!--          <img v-bind:src="scope.row.summaryUrl" alt style="max-width:10em" />-->
<!--        </template>-->
<!--      </el-table-column>-->

      <div slot="top-actions">
        <el-button type="primary" @click="addDialog=true">添加</el-button>
      </div>

      <el-table-column slot="actions" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="editDynamic(scope.row)">编辑</el-button>
          <el-button type="danger" @click="openDeleteMode(scope.row)" slot="reference">删除</el-button>
        </template>
      </el-table-column>
    </List>

    <el-dialog :visible.sync="addDialog" :close-on-click-modal="false" v-if="addDialog">
      <el-form>
        <el-form-item label="标题：" label-width="6rem;">
          <el-input v-model="dynamicItem.title" placeholder="动态标题"></el-input>
        </el-form-item>
        <el-form-item label="摘要：" label-width="6rem;">
          <el-input v-model="dynamicItem.summary" placeholder="动态摘要"></el-input>
        </el-form-item>
<!--        <el-form-item label="摘要图片：" label-width="6rem;">-->
<!--          <ImageInput v-model="dynamicItem.summaryUrl" url="common/addPictureUrl"></ImageInput>-->
<!--        </el-form-item>-->

        <el-form-item label="内容：" label-width="6rem;">
          <text-editor v-model="dynamicItem.content" placeholder="动态内容"></text-editor>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button @click="save()">提交</el-button>
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
      dynamicItem: {},
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
        this.dynamicItem = {};
      }
    }
  },
  methods: {
    cloneInput() {
      this.dynamicItem = "";
      this.addDialog = false;
    },
    editDynamic(item) {
      this.dynamicItem = JSON.parse(JSON.stringify(item));
      this.addDialog = true;
    },

    openDeleteMode(item) {
      this.deleteList = item;
      this.showDelete = true;
    },
    cloneDeleteMode() {
      this.showDelete = false;
    },

    deleteTeam() {
      let vm = this;
      console.log(this.deleteList.id);

      vm.ax
        .post("/webpage/delete", this.deleteList)
        .then(it => {
          vm.success("删除成功");
          vm.dynamicItem = {};
          this.getBanner();
          this.cloneDeleteMode();
        })
        .catch(it => {
          vm.error(it);
        });
    },

    save() {
      let vm = this;
      //设置推荐故事 name
      vm.dynamicItem.name = "yagu_dynamic";
      if (!vm.dynamicItem.id) {
        // let api = this.publicProjectId;
        vm.ax
          .post("/webpage/save", vm.dynamicItem)
          .then(it => {
            vm.getBanner();
            vm.cloneInput();
            vm.$message.success("操作成功");
          })
          .catch(it => {
            vm.error(it);
          });
      } else {
        vm.ax
          .post("/webpage/updatebyid", vm.dynamicItem)
          .then(it => {
            vm.cloneInput();
            vm.getBanner();
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
            name: "yagu_dynamic",
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
      let projectStatus = {
        0: "考察",
        1: "已投资",
        2: "待投资",
        3: "预投资",
        4: "完成"
      };

      // let investmentType = {
      //   0: "零售",
      //   1: "其他",
      //   2: "休闲娱乐",
      //   3: "亲子",
      //   4: "共享"
      // };

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


