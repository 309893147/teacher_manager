<template>
  <div class="teacherInfo" :loading="loading">
   
    <div class="userList">
      <el-table
          @select="handleSelectionChange"
          @select-all="handleSelectionChange"
          :data="userData"
          style="width: 100%">
        <el-table-column
            prop="username"
            label="用户名">
        </el-table-column>
        <el-table-column
            prop="status"
            label="角色">
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="联系电话">
        </el-table-column>
        <el-table-column
            prop="email"
            label="院系">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "teacherInfo",
    data(){
      return {
        userData: [],
        // 新建
        username: '',  // 用户名
        mobile: '',  // 手机
        status:''
      }
    },
    methods:{
      getUserData(){
        this.loading = true;
        this.$axios.get('/teacher/user/getTeacherByid')
            .then(res =>{
              if(res.data.status === 200){
                this.loading = false;
                this.userData = res.data.body.dataList
                console.log(res.data.body)
              }
            })
      },
    },
    created() {
      this.getUserData();
    },
    mounted() {
      
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .teacherInfo{

    .userList{
      .user_avatar{
        width: 50px;
        height: 50px;
        object-fit: contain;
      }
      .user_desc{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 300px;
      }
    }

  }
</style>