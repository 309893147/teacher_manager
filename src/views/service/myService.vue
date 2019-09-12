<template>
  <div class="myService">
    <Table-List :header="tableHeader" :data="tableData" @page="getDataList" :page="pageInfo">
      <div slot="top-actions">
        <el-button type="primary" @click="showAddDialogBtn">添加</el-button>
      </div>
      <el-table-column slot="actions" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="editDialogBtn(scope.row)">编辑</el-button>
          <el-button size="mini" @click="detailDialogBtn(scope.row)">详细列表</el-button>
          <el-button size="mini" type="danger" @click="deleteDialogBtn(scope.row)" slot="reference">删除</el-button>
        </template>
      </el-table-column>
    </Table-List>

    <!-- 添加or修改弹窗 -->
    <el-dialog :visible.sync="addDialog" :close-on-click-modal="false" width="400px">
      <el-form>
        <el-form-item label="客服问题标题：" label-width="6rem;">
          <el-input v-model="serviceTitle" placeholder="客服问题标题"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button @click="saveDataBtn">提交</el-button>
      </div>
    </el-dialog>

    <!-- 详细列表弹窗 -->
    <el-dialog :visible.sync="detailDialog" :close-on-click-modal="false">
      <Table-List :header="detailTableHeader" :data="detailTableData">
        <div slot="top-actions">
          <el-button size="mini" type="primary" @click="showAddDetailDialogBtn">添加</el-button>
        </div>
        <el-table-column slot="actions" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="editDetailDialogBtn(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteDetailDialogBtn(scope.row)" slot="reference">删除</el-button>
          </template>
        </el-table-column>
      </Table-List>
    </el-dialog>

    <!-- 添加or修改详细列表弹窗 -->
    <el-dialog :visible.sync="addDetailDialog" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="问题标题：" label-width="6rem;">
          <el-input v-model="detailTitle" placeholder="问题标题"></el-input>
        </el-form-item>
        <el-form-item class="detail_content" label="问题内容：" label-width="6rem;">
          <text-editor v-model="detailContent" placeholder="通知内容"></text-editor>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDetailDialog = false">取消</el-button>
        <el-button @click="saveDetailDataBtn">提交</el-button>
      </div>
    </el-dialog>

    <!-- 删除弹窗 -->
    <el-dialog :visible.sync="showDelete" width="250px">
      确认是否删除
      <div slot="footer">
        <el-button @click="showDelete = false">取消</el-button>
        <el-button @click="deleteTeam()" type="primary">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "myService",
    components:{
      'TableList':() => import("@/components/List"),
      'TextEditor':() => import("@/components/TextEditor")
    },
    data(){
      return{
        listData: [],  // 列表数据

        serviceId: null, // 客服问题列表ID

        editListItem: '', // 修改单条数据
        detailListItem: '', // 详细信息列表

        addDialog: false,  // 添加弹窗
        serviceTitle: '',  // 客服问题标题

        serviceDetailId: '', // 详细列表ID
        detailDialog: false, // 详细列表弹窗
        detailList: [], // 详情列表
        addDetailDialog: false,  // 新建or编辑详细列表弹窗
        detailTitle: '',  // 详细列表标题
        detailContent: '', // 详细列表内容

        showDelete: false,  // 删除弹窗

        pageInfo: {},  // 分页信息
        page: {  // 分页
          currentPage: null,
          pageSize: null
        }
      }
    },
    methods:{
      // 获取数据
      getDataList(page, size){
        this.ax.get('/customer/service/list',{
          params: {
            "page.currentPage": page,
            "page.pageSize": size,
            ...this.filter
          }
        })
            .then(res =>{
              this.listData = res.dataList
              this.pageInfo = res.page;
            })
      },

      // 打开新建弹窗
      showAddDialogBtn(){
        this.addDialog = true;
        this.serviceTitle = '';
        this.serviceId = null
      },
      // 提交按钮
      saveDataBtn(){
        let data={
          name: this.serviceTitle,
          id: this.serviceId
        };
        let type = 'add';
        if(this.serviceId){
          type = 'update'
        }
        this.ax.post('/customer/service/'+type,data)
            .then(res =>{
              this.$message.success('修改成功')
              this.addDialog = false
              this.getDataList()
            })
      },
      // 打开编辑弹窗
      editDialogBtn(item) {
        this.serviceId = item.id
        this.serviceTitle = item.name;
        this.addDialog = true;
      },

      // 打开详细列表弹窗
      detailDialogBtn(item){
        this.serviceId = item.id
        this.detailList = item.customerServiceSonDtos;
        this.detailDialog = true;
      },
      // 添加详细列表
      showAddDetailDialogBtn(){
        this.serviceDetailId = ''
        this.detailTitle = ''
        this.detailContent = ''
        this.addDetailDialog = true
      },
      // 编辑详细列表
      editDetailDialogBtn(item){
        this.serviceDetailId = item.id
        this.detailTitle = item.name
        this.detailContent = item.content
        this.addDetailDialog = true
      },
      // 新建or提交详细列表
      saveDetailDataBtn(){
        let type = 'add';
        let data;
        data ={
          name: this.detailTitle,
          content: this.detailContent,
          customerServiceId: this.serviceId
        }
        if(this.serviceDetailId) {
          type = 'update';
          data = {
            name: this.detailTitle,
            content: this.detailContent,
            id: this.serviceDetailId
          }
        }
        this.ax.post('/customer/service/'+type+'/son',data)
            .then(res =>{
              this.$message.success('添加成功')
              this.getDataList()
              this.addDetailDialog = false
              this.detailDialog = false
            })
      },

      // 打开删除弹窗
      deleteDialogBtn(item) {
        this.serviceId = item.id;
        this.showDelete = true;
      },
      deleteDetailDialogBtn(item){
        this.serviceDetailId = item.id;
        this.showDelete = true;
      },
      // 确认删除
      deleteTeam(){
        let data;
        let type = '';
        data={
          customerServiceId: this.serviceId
        };
        if(this.serviceDetailId !== ''){
          data={
            customerServiceSonId: this.serviceDetailId,
          };
          type = '/son'
        }

        this.ax.post('/customer/service/delete'+type,data)
            .then(res =>{
              this.$message.success('删除成功')
              this.serviceId = null;
              this.showDelete = false;
              this.getDataList()
              this.addDetailDialog = false
              this.detailDialog = false
            })
      },
    },
    computed: {
      // 父级列表
      tableData() {
        return this.listData.map(it => {
          return it;
        });
      },
      tableHeader() {
        return [
          {
            key: "name",
            name: "客服问题标题"
          },{
            key: 'createDate',
            name: '创建时间'
          }
        ];
      },

      // 详细列表
      detailTableData() {
        return this.detailList.map(it => {
          return it;
        });
      },
      detailTableHeader() {
        return [
          {
            key: "name",
            name: "问题标题"
          }, {
            key: "content",
            name: "问题内容"
          },{
            key: 'createDate',
            name: '创建时间'
          }
        ];
      },
    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .myService{
    /deep/.detail_content{
      .el-form-item__label{
        float: unset !important;
      }
    }
  }
</style>