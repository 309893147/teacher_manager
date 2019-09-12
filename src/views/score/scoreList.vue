<template>
  <div class="scoreList">
    <List :header="tableHeader" :data="tableData" @page="getDataList" :page="pageInfo" :disableAction="true">
      <el-table-column slot="actions" label="操作" width="1">
      </el-table-column>
    </List>
  </div>
</template>

<script>
  export default {
    name: "scoreList",
    components:{
      'List': () => import("@/components/List")
    },
    data(){
      return {
        listData: [],
        pageInfo: {},
        page: {
          currentPage: null,
          pageSize: null
        }
      }
    },
    created() {
      this.getDataList()
    },
    methods:{
      getDataList(page,size){
        this.ax.get('/user/invite/score/list',{
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
    },

    computed: {
      tableData() {
        let useType = {
          0: "增加积分",
          1: "消费积分"
        };
        let type = {
          0: "邀请",
          1: "购买项目"
        };

        return this.listData.map(it => {
          it.useType = useType[it.useType];
          it.type = type[it.type];
          return it;
        });
      },
      tableHeader() {
        return [
          {
            key: "name",
            name: "积分类型"
          }, {
            key: "score",
            name: "积分"
          }, {
            key: "type",
            name: "购买项目"
          }, {
            key: "useType",
            name: "积分状态"
          }, {
            key: "userName",
            name: "邀请人"
          }, {
            key: "invitedUserName",
            name: "被邀请人"
          }
        ];
      }
    }
  }
</script>

<style scoped>

</style>