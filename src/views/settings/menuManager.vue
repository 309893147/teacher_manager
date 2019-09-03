<template>
  <div class="menuManager">
    <div class="menu_list">
      <div class="title">
        <div class="search">
          <p>名称</p>
          <el-input v-model="searchInput"></el-input>
        </div>
        <div class="setting_btn">
          <p class="search_btn">搜索</p>
          <p class="refresh_btn">刷新</p>
          <p class="add_btn">添加</p>
        </div>
      </div>

      <el-tree
          :data="menuList"
          show-checkbox
          :load="loadNode"
          lazy
          :props="defaultProps"
          @check-change="handleNodeClick()"></el-tree>

    </div>

    <div class="manager_card">

    </div>

  </div>
</template>

<script>
  export default {
    name: "menuManager",
    data(){
      return {
        searchInput: '', // 列表搜索框

        checkList: [],
        menuList: [],
        defaultProps:{
          children: 'childs',
          label: 'title'
        },
        count: 1,
      }
    },
    created(){
      this.getMenuList()
    },
    methods:{
      getMenuList(){
        this.$axios.get('manager/menu/tree')
            .then(res =>{
              this.menuList = res.data.body.childs
            })
      },

      handleNodeClick(data, checked, indeterminate){
        console.log(data, checked, indeterminate);
      },

      loadNode(node, resolve){
        console.log(node.data);

        setTimeout(() => {
          let data;
          if (node.hasChild) {
            data = node.data;
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
      }

    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .menuManager{
    display: flex;
    flex: 2;
    .menu_list{
      flex: 1;
      .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10%;
        margin-bottom: 15px;
        .search{
          display: flex;
          align-items: center;
          >p{
            flex-shrink: 0;
            margin-right: 15px;
          }
        }
        .setting_btn{
          display: flex;
          align-items: center;
          >p{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 2px 5px;
            border: 1px solid #dedede;
            cursor: pointer;
            border-radius: 2px;
            &:not(:last-child){
              margin-right: 10px;
            }
          }
        }
      }
      .list_main{
        display: flex;
        flex-direction: column;
        /deep/.el-checkbox{
          margin: 0;
        }
      }
    }
    .manager_card{
      flex: 1;
    }
  }
</style>