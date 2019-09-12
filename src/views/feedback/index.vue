<template>
  <div class="feedback">
    <Table-List :header="tableHeader" :data="tableData" @page="getDataList" :page="pageInfo">
      <el-table-column slot="actions" label="操作" width="1"></el-table-column>
    </Table-List>
  </div>
</template>

<script>
  export default {
    name: "index",
    components:{
      'TableList':() => import("@/components/List")
    },
    data(){
      return{
        listData: [],
        pageInfo: {},
        page: {
          currentPage: null,
          pageSize: null
        }
      }
    },
    methods:{
      getDataList(page, size){
        this.ax.get('/opinion/list',{
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
    },
    computed: {
      tableData() {
        return this.listData.map(it => {
          return it;
        });
      },
      tableHeader() {
        return [
          {
            key: "userName",
            name: "用户名"
          },
          {
            key: "remarks",
            name: "反馈内容"
          },
          {
            key: "createDate",
            name: "创建时间"
          }
        ];
      }
    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .feedback{

  }
</style>