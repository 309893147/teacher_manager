<template>
    <div>
        <List @page="getArea" :header="tableHeader" :disableAction='true' :data="menus">
            <div slot="top-actions">
                <el-button @click="showAddDialog=true" type="primary">添加城市</el-button>
            </div>
        </List>
        <el-dialog :visible.sync="showAddDialog">
            <el-form>
                    <el-form-item label="名称" label-width="10em">
                        <el-input placeholder="名称" v-model="newModel.title"></el-input>
                    </el-form-item>       
            </el-form>
            <div slot="footer">
                <el-button @click="showAddDialog = false">取消</el-button>
                <el-button @click="addArea" type="primary" :loading="loading">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import areaMenu from "@/components/areaMenu"
import DeleteButton from '@/components/DeleteButton'
import  {Message} from 'element-ui'
import List from "@/components/List";
import qs from 'qs'
export default {
    components: {
        areaMenu,
        DeleteButton,
        List
    },
    data () {
        return {
            showSubway: false,
            showGpsPicker: false,
            showAddDialog: false,
            loading: false,
            selectedArea: {},
            newModel: {
                title: null,
                firstPinyinLetter: null,
                isReviewUnit:0,
                adCode: 0,
                isHot: 0,
                parentId: 0,
                status: 0,
                level: 0
            },
            pinyin: [],
            menus: []
        }
    },
    watch: {
        showAddDialog (val) {
            if(!val){
                let model =  this.newModel
                delete model.id
                model.title = null
                model.isHot = 0
                model.adCode = 0
                model.firstPinyinLetter = null
                model.isStation = 0
                model.parentId = null
                model.level = null
            }
        },
    },
    created () {
        
    },
    computed:{
        tableHeader(){
            return [
                {
                    key: 'title',
                    name: '城市'
                },
                {
                    key: "createTime",
                    name: "创建时间"
                }
            ]
        }
    },
    methods: {
        addArea () {
            let vm = this
            let payload = this.newModel
            delete payload.sub
            delete payload.createTime
            delete payload.updateTime
            vm.loading = true
            this.ax.post("area", qs.stringify(payload)).then(it => {
                vm.loading = false
                vm.showAddDialog = false
                if(payload.id){
                    let sub = vm.selectedArea.sub
                    Object.assign(vm.selectedArea,it)
                    vm.selectedArea.sub = sub
                    return
                }
                if(payload.parentId === 0) {
                    vm.menus.push(it)
                } else {
                    if(!vm.selectedArea.sub){
                        vm.selectedArea.sub = []
                    }
                    vm.selectedArea.sub.push(it)
                }  
            })
        },
        getArea (area){
            let parentId = area && area.id || 0
            let vm = this
            this.ax.get('area',{params: {parentId: parentId}}).then(it => {
                if(parentId) {
                    area.sub = it.content
                    vm.$refs.menu.openMenu(area.path)
                } else {
                    vm.menus = it.content
                }
            })
        }
    }
}
</script>
<style scoped>
    .right-content{
        padding: 10px;
    }

</style>


