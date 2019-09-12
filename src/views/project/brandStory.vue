<template>
    <div>
            
            <text-editor v-model="brandStroy" ></text-editor>
            <div class="action-wrapper">
                <el-button type="primary" :loading="loading" @click="updateBrandStory">保存</el-button>
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
    },
    watch:{
        $route(){
            this.policyName = this.$route.name
           this.getPolicy()
        }
    },
    methods: {
        getPolicy(){
          let vm = this
          this.ax.get("web?name="+this.policyName).then(data =>{
              vm.content = data && data.content || ""
          })
        },
        updateBrandStory(){
            let vm = this
            vm.loading = true
            this.ax.post("/publicproject/update",{brandStroy:this.brandStroy}).then(()=>{
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
    .action-wrapper{
        padding: 20px;
        text-align: right;
    }
</style>


