<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加按钮 -->
    <el-button type="success" plain @click ="$router.push('goods-add')">添加商品</el-button>

    <!-- 数据 -->
    <el-table ref="singleTable" :data="goodsList" highlight-current-row style="width: 100%" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称"></el-table-column>
      <el-table-column property="goods_price" label="商品价格"></el-table-column>
      <el-table-column property="goods_number" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot= "{row}">
          {{row.add_time | timeformat}}
        </template>
      </el-table-column>
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
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>




<script>
import moment from 'moment'
export default {
  filters : {
    timeformat(value){
      return moment.unix(value).format("YYYY-MM-DD HH:mm:ss")
    }
  },
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 6,
      total: 0
    };
  },
  methods: {
    changePage(currentPage) {
      this.pagenum = currentPage;
      this.getGoodsList();
    },

    async getGoodsList() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.goodsList = res.data.data.goods;
      this.total = res.data.data.total;
    }
  },
  created(){
    this.getGoodsList()
  }
};
</script>


<style>
.breadcrumb {
  margin-bottom: 10px;
}
</style>
