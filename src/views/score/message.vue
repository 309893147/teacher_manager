<template>
  <div class="message">
    <List :header="tableHeader" :data="tableData" @page="getDataList" :page="pageInfo" :disableAction="true">
      <div slot="top-actions">
        <el-button type="primary" @click="addListShow">添加</el-button>
      </div>
      <el-table-column slot="actions" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="editListShow(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="removeList(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </List>

    <el-dialog :visible.sync="addDialog" width="30%">
      <div>
        <el-form>
          <el-form-item label="关键字：" label-width="6rem;">
            <el-input v-model="name" placeholder="关键字"></el-input>
          </el-form-item>
          <el-form-item label="信息内容：" label-width="6rem;">
            <el-input v-model="messageContent" placeholder="信息内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="是否删除" :visible.sync="deleteDialog" width="30%">
      <div>是否删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "message",
    components:{
      'List': () => import("@/components/List")
    },
    data(){
      return {
        deleteDialog: false, // 删除弹窗
        addDialog: false,  // 新增or编辑弹窗
        messageId: '',

        name: '',
        messageContent: '',

        listData: [],
        pageInfo: {},
        page: {
          currentPage: null,
          pageSize: null
        }
      }
    },
    methods:{
      getDataList(page,size){
        this.ax.get('/common/message/list',{
          params: {
            "page.currentPage": page,
            "page.pageSize": size,
            ...this.filter
          }
        })
            .then(res =>{
              this.listData = res.dataList;
              this.pageInfo = res.page;
            })
      },

      closeDialog(){
        this.messageId = ''
        this.addDialog = false
        this.name = ''
        this.messageContent = ''
      },
      // 新增
      addListShow(){
        this.messageId = ''
        this.name = ''
        this.messageContent = ''
        this.addDialog = true
      },
      // 编辑
      editListShow(val){
        this.messageId = val.id
        this.name = val.key
        this.messageContent = val.message
        this.addDialog = true
      },
      saveSubmit(){
        let data ={
          id: this.messageId,
          key: this.name,
          message: this.messageContent,
        }
        if(this.messageId !== ''){
          this.ax.post('/common/update/message',data)
              .then(res =>{
                this.$message.success('编辑成功')
                this.addDialog = false
                this.messageId = ''
                this.getDataList()
              })
        } else {
          this.ax.post('/common/add/message',data)
              .then(res =>{
                this.$message.success('添加成功')
                this.addDialog = false
                this.getDataList()
              })
        }
      },
      // 删除
      removeList(val){
        this.deleteDialog = true
        this.messageId = val.id
      },
      deleteSubmit(){
        let data ={
          messageId: this.messageId
        }
        this.ax.post('/common/delete/message',data)
            .then(res =>{
              this.$message.success('删除成功')
              this.deleteDialog = false
              this.messageId = ''
              this.getDataList()
            })
      },
    },
    created() {
      this.getDataList()
    },
    computed: {
      tableData() {
          return this.listData
      },
      tableHeader() {
        return [
          {
            key: "key",
            name: "关键字"
          }, {
            key: "message",
            name: "信息内容"
          }
        ];
      }
    }
  }
</script>

<style scoped>
  .message{

  }
</style>