<template>
  <el-col>
    <div class="wrapper">
      <div class="title">{{title}}:</div>
      <div class="content">{{content}}</div>
    </div>
  </el-col>
</template>
<script>
export default {
  props: ["title", "content"]
};
</script>
<style scoped>
.wrapper {
  display: flex;
  padding: 0.4rem 0;
}
.title {
  margin-right: 0.4rem;
  color: #bbb;
}
</style>


