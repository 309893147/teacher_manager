<template>
  <div class="courseManager">
    <div class="courseManager">
      <div slot="top-actions">
        <el-button type="primary" @click="addCourseMessage = true">添加科目</el-button>
      </div>
      <el-table :data="courseData" style="width: 100%">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="cname" label="科目"></el-table-column>
        <el-table-column prop="dept" label="院系"></el-table-column>
        <el-table-column prop="teacher" label="任课教师"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updateCourse()">修改</el-button>
            <el-button size="mini" type="danger" @click="removeCourse(scope.row.userId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加科目界面 -->
    <el-dialog :title="'添加科目'" :visible.sync="addCourseMessage">
      <div class="edit_user_main">
        <div>
          <p>科目：</p>
          <el-input type="text" :row="5" v-model="evaluation"></el-input>
        </div>
        <div>
          <p>院系：</p>
            <el-select placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
        </div>
         <div>
          <p>任课老师：</p>
            <el-select placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addCourseMessage = false">取 消</el-button>
        <el-button type="primary" @click="submitEvaluation()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改科目界面 -->
    <el-dialog :title="'修改科目'" :visible.sync="updateCourseMessage">
      <div class="edit_user_main">
        <div>
          <p>题目内容：</p>
          <el-input type="textarea" :row="5" v-model="evaluation"></el-input>
        </div>
        <div>
          <p>题目内容：</p>
          <el-input type="textarea" :row="5" v-model="evaluation"></el-input>
        </div>
        <div>
          <p>题目内容：</p>
          <el-input type="textarea" :row="5" v-model="evaluation"></el-input>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="updateCourseMessage = false">取 消</el-button>
        <el-button type="primary" @click="submitEvaluation()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from "element-ui";
import qs from "qs";
export default {
  name: "courseManager",
  data() {
    return {
      courseData: [],
      username: "", //姓名
      mobile: "", //电话
      roleName: "", //角色
      deptName: "", //院系

      updateCourseMessage: false, //是否显示修改科目界面
      addCourseMessage: false, //是否显示添加科目界面
      evaluation: "", //输入的题目内容
      updateId: "", //修改题目的id
      question: "" // 试题内容
    };
  },
  methods: {
    //弹出修改科目界面
    updateCourse() {
      this.updateCourseMessage = true;
    },

    // 获取学生列表信息
    getStudentData() {
      this.ax
        .get("/user/getUserInfoByRolr", { params: { role: 0 } })
        .then(it => {
          this.StudentData = it.dataList;
          console.log(this.StudentData);
        });
    },

    //删除学生
    removeStudent(sid) {
      console.log(sid);
      let data = {
        userIds: String(sid)
      };
      this.ax.post("/user/delete", data).then(it => {
        // 界面数据删除
        this.StudentData.some((item, i) => {
          if (item.userId == sid) {
            this.StudentData.splice(i, 1);
            return true;
          }
        });
        Message({
          message: "删除成功",
          type: "success"
        });
      });
    }
  },
  created() {},
  mounted() {
    this.getStudentData();
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.courseManager {
  .userList {
    .user_avatar {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }
    .user_desc {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 300px;
    }
  }
}
</style>