<template>
  <el-container>

    <el-header>
      <el-row type="flex"  justify="space-between">
        <el-col :span="6">
          <img src="../assets/logo.png" alt="">
        </el-col>
        <el-col>
          <h1>品优购后台管理系统</h1>
        </el-col>
        <el-col :span="6" class="header-right">
          <div>
            欢迎39期会员
            <a href="##">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside width="200px">
        Aside            
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {};
</script>

<style>
.el-container {
  height: 100%;
}
.el-container .el-header {
  line-height: 60px;
  background-color: #b3c1cd;
  padding: 0;
}
.el-container .el-header img{
  width: 200px;
}
.el-container .el-header h1{
  font-size: 28px;
  color: #fff;
  font-weight: bolder;
  padding: 0;
  margin: 0;
  text-align: center;
}
.header-right{
  font-weight: bolder;
  text-align: right;
  padding-right: 20px;
}
.el-container .el-header div a {
    color: orange;
}
</style>

