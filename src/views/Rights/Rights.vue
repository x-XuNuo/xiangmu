<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
  .el-breadcrumb.el-breadcrumb {
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
    font-size: 16px;
    background-color: cyan;

  }
</style>
