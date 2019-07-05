<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加按钮 -->
    <el-button type="success" plain @click="showAddCateDialog">添加分类</el-button>

    <!-- 数据 -->

    <el-table ref="singleTable" :data="categoryList" stripe style="width: 100%">
      <!-- file-icon指的就是叶子节点的图标
            folder-icon指的就是可展开的项的图标
            prop 指的就是当前列要显示的数据的属性名称
            label 指的就是表头 
            treeKey 节点的唯一表示
            parentKey 数据的父节点id
            childKey 当前节点的所有子节点存放的属性的名字 默认是children

            indent-size是用来设置每个层级之间的缩进距离的
            设置indent-size 需要同时制定 层级属性

            level-key:    设置为数据中标识层级的属性名即可
      -->
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        file-icon="el-icon-notebook-2"
        folder-icon="el-icon-folder"
        width="220"
        tree-key="cat_id"
        parent-key="cat_pid"
        :indent-size="50"
        level-key="cat_level"
      ></el-table-tree-column>
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

    <!-- 模态框 -->
    <el-dialog title="添加分类" :visible.sync="isShowAddCateDialog">
      <el-form ref="addCateForm" :model="addCateFormData" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="addCateFormData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            v-model="addCateFormData.parentArr"
            :options="cateOptions"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="isShowAddCateDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 当前页面中要用到 一个第三方的表格插件（ElementUI的插件）
// element-tree-grid

// 安装  npm i element-tree-grid -S

// 使用：
// 如果需要全局使用，可能很多页面里面都会用到这个组件，那么就把下面这两句代码放到main.js中
// const ElTreeGrid = require('element-tree-grid');
// Vue.component(ElTreeGrid.name, ElTreeGrid)

// 如果只是需要某个页面中使用，只需要进行局部注册组件即可
// 在使
const ElTreeGrid = require("element-tree-grid");
// 页面中使用该组件，只需要用  el-table-tree-column 标签即可

export default {
  // 注册组件
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      isShowAddCateDialog: false,
      addCateFormData : {
        cat_name : "",
        parentArr : []
      },
      cateOptions :[],
      defaultProps : {
        value : "cat_id",
        label : "cat_name",
        checkStrictly : true
      }

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
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      console.log(res);
      this.categoryList = res.data.data.result;
      this.total = res.data.data.total;
    },

    // 模态框

    async showAddCateDialog() {
      // 发送axios获取数据
      let res = await this.$http({
        url: "categories",
        params: {
          type: 2
        }
      });
      this.cateOptions = res.data.data

      this.isShowAddCateDialog = true;
    },
    pageChange(currentPage) {
      this.pagenum = currentPage;
      this.getCategoryList();
    }
  }
};
</script>

<style>
</style>
