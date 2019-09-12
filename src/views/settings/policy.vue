<template>
    <div>
      <div>
        <el-input class="title" v-model="title" placeholder="请输入标题"></el-input>
      </div>
      <div v-if="show">
        <text-editor  v-model="content" style="margin-left:80px"></text-editor>
      </div>
      <div v-else>
        <el-input
          class="textarea"

          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="content">
      </el-input>
      </div>
            <div class="action-wrapper">
                <el-button type="primary" :loading="loading" @click="updatePolicy">保存</el-button>
            </div>
    </div>
</template>
<script>
import qs from 'qs'
import TextEditor from "@/components/TextEditor"
import {Message} from 'element-ui'
export default {
    components: {
        Message,
        TextEditor
    },
    data () {
        return {
          show: true,

          title: '',

            content: null,
            policyName: null,
            loading:false,
            editorConfig: {
                language_url: '/js/tinymce/zh_CN.js',
                height: '400px'
            }
        }
    },
    created(){
        this.policyName = this.$route.query.name
        this.title = this.$route.query.title
        this.getPolicy()
      if(this.policyName === 'Invitation_rule' || this.policyName === 'invite_friends' || this.policyName === 'Investment_project'){
        this.show = false
      }
    },
    // watch:{
    //     $route(){
    //
    //         this.policyName = this.$route.name
    //         this.title = this.$route.query.title
    //         this.getPolicy()
    //     }
    // },
    methods: {
        getPolicy(){
          let vm = this
          this.ax.get("webpage/querybyname?name="+this.policyName).then(data =>{
            data.map(res =>{
              vm.title = data && res.title || ""
              vm.content = data && res.content || ""
            })
          })
        },
        updatePolicy(){
            let vm = this
            vm.loading = true
            this.ax.post("webpage/update",{title: this.title,name:this.policyName,content:this.content}).then(()=>{
                vm.loading = false
                  Message({
                    message: '保存成功',
                    type: 'success',
                    duration: 2 * 1000
                })
            })  
        }
    }
}
</script>
<style scoped>
  .title{
    margin-left: 80px;
    margin-bottom: 20px;
    width: 700px;
  }
  .textarea{
    margin-left: 80px;
    width: 700px;
  }
    .action-wrapper{
        padding: 20px;
        text-align: right;
    }
</style>


