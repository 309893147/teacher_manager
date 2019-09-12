<template>
  <div class="platformData">
    <el-form>
      <el-form-item label="参与人数：" label-width="6rem;">
        <el-input type="number" v-model="dataList.participantsNumber" placeholder="参与人数"></el-input>
      </el-form-item>
      <el-form-item label="投资项目数量：" label-width="6rem;">
        <el-input type="number" v-model="dataList.investmentProject" placeholder="投资项目数量"></el-input>
      </el-form-item>
      <el-form-item label="成价额：" label-width="6rem;">
        <el-input type="number" v-model="dataList.turnover" placeholder="成价额"></el-input>
      </el-form-item>
      <el-form-item label="平台简介：" label-width="6rem;">
        <el-input type="textarea"
                  maxlength="200"
                  :rows="5"
                  show-word-limit
                  v-model="dataList.platformIntroduction"
                  placeholder="平台简介"></el-input>
      </el-form-item>
      <el-form-item label-width="6rem;" class="save_btn">
        <el-button type="primary" @click="saveBtn">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  export default {
    name: "platformData",
    data(){
      return {
        dataList: {}
      }
    },
    methods:{
      getDataList(){
        this.ax.get('/order/platform/data')
            .then(res =>{
              this.dataList = res
            })
      },
      saveBtn(){
        this.ax.post('/order/update/platform',this.dataList)
            .then(res =>{
              this.$message.success('保存成功')
            })
      },
    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped>
  .save_btn{
    text-align: right;
  }
</style>