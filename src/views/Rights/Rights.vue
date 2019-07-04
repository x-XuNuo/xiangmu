<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 数据 -->
    <el-table
      ref="singleTable"
      :data="rightsList"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="50">

      </el-table-column>
      <el-table-column property="authName" label="权限名称" width="120"></el-table-column>
      <el-table-column property="path" label="路径" width="120"></el-table-column>
      <el-table-column label="层级">
        <template v-slot="{row}">
          <span>{{row.level | levelfilter}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  filters : {
    levelfilter(value){
      switch(value){
        case "0":
          return "一级";
        case "1":
          return "二级";
        case "2":
          return "三级";

      }
    }
  },
    data() {
        return {
            rightsList: []
        };
    },
  async created() {
    let res = await this.$http({
      url: "rights/list"
    });

    console.log(res)

    this.rightsList = res.data.data;
  }
};
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
