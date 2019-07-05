<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加按钮 -->
    <el-button type="success" plain>添加分类</el-button>

    <!-- 数据 -->

    <el-table ref="singleTable" :data="categoryList" stripe style="width: 100%">
      <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column>
      <el-table-column label="是否有效" width="180">
        <template v-slot="{row}">{{row.cat_deleted ? "否" : "是"}}</template>
      </el-table-column>
      <el-table-column prop="cat_pid" label="层级"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pagesize"
      :current-page="pagenum" 
      :total="total" 
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    async getCategoryList() {
      let res = await this.$http({
        url: "categories",
        params: {
          // type : 3,
          pagenum : this.pagenum,
          pagesize : this.pagesize
        }
      });
      console.log(res);
      this.categoryList = res.data.data.result;
      this.total = res.data.data.total
    },
    pageChange(currentPage){
      this.pagenum = currentPage;
      this.getCategoryList()
    }
  }
};
</script>

<style>
</style>
