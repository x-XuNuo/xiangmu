<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="keyword"
          @keyup.enter.native="search"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 数据 -->
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>

      <!-- 如果当前列中不会把数据直接展示出来，那么就没有必要为当前列设置prop属性 -->
      <el-table-column label="用户状态">
        <!-- 在这里，无法直接获取到每一行的数据，这个数据在el-table表格组件中 -->
        <!-- 如果要获取每一行的数据，那么我们就需要通过作用于插槽的方式，把数据接收到 -->
        <!-- 开关 -->
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleState(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 三个操作 -->
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delUser(row.id)"></el-button>
          <el-button type="success" plain size="mini" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- @current-change="onPageChange" 这个是页码发生改变的时候触发的事件 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="onPageChange"
    ></el-pagination>
  </div>
</template>

// <script>
import axios from "axios";
export default {
  data() {
    return {
      userList: [],
      total: 0,
      pagesize: 3,
      currentpage: 1,
      keyword: ""
    };
  },
  // 发送ajax请求
  created() {
    this.getUserList();
  },


  methods: {
    getUserList() {
      axios({
        // 地址
        url: "http://localhost:8888/api/private/v1/users",
        params: {
          query: this.keyword,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        let {
          data: { data, meta }
        } = res;
        this.userList = data.users;
        this.total = data.total;
      });
    },
    // 搜索功能
    onPageChange(page) {
      this.currentpage = page;
      this.getUserList();
    },
    search() {
      // 只需要调用getUserList方法，重新请求数据即可
      this.getUserList();
    },
    // 状态修改
    async toggleState(user) {
      // 在这里应该给后台发送数据请求，将当前用户的状态进行修改
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
        method: "put",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      this.getUserList();
    },
    // 删除
    async delUser(id) {
      try {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // console.log(111)
        let res = await axios({
          url: `http://localhost:8888/api/private/v1/users/${id}`,
          method: "delete",
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }

      this.getUserList();
    },
  }
};
</script>
<style>
.el-breadcrumb.breadcrumb {
  background-color: #d4dae0;
  height: 50px;
  padding-left: 10px;
  line-height: 50px;
  font-size: 16px;
  margin-bottom: 5px;
}
</style>
