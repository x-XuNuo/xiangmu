<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 数据列表 -->

    <el-table ref="roleTable" :data="roseList" stripe style="width: 100%">
      <!-- 通过设置 type="expand" 和 Scoped slot 可以开启展开行功能，el-table-column 的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 Scoped slot 相同。 -->
      <el-table-column type="expand">
        <!-- 展开菜单内容 -->
        <template v-slot="{row}">
          <!-- 获取一级菜单 el-row level1 -->
          <el-row v-for="level1 in row.children" :key="level1.id" class="level1" type="flex">
            <el-col :span="6">
              <el-tag closable @close = "deleteRight(row,level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级菜单 -->
            <el-col>
              <el-row v-for="level2 in level1.children" :key="level2.id" class="level2" type="flex">
                <el-col :span="6">
                  <el-tag closable type="success"  @close = "deleteRight(row,level2.id)">{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级菜单 -->
                <el-col>
                  <el-tag
                    closable
                    type="warning"
                    class="level3"
                    v-for="level3 in level2.children"
                    @close = "deleteRight(row,level3.id)"
                    :key="level3.id"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <!-- el-table-column 只需要加上 type="index" 就可以自动生成序号列 -->
      <!-- :index="getIndex"  通过给index属性绑定函数，可以完成自定义序列号 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
          <el-button
            type="success"
            plain
            size="mini"
            icon="el-icon-check"
            @click="showAssainRightsDialog(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出模态框 -->
    <el-dialog title="角色授权" :visible.sync="isAssainRightDialogShow">
      <!-- data 是用来绑定数据的
      show-checkbox是用来设置是否要展示 checkbox
      node-key 指的是当前节点的唯一表示
      default-expanded-keys 这是一个数组，表示默认让哪些节点展开
      default-checked-keys 这是一个数据，表示默认选中哪些节点
      props:  children是用来指定子级树的数据属性名，label以及节点要展示到文字的属性名-->
      <!-- default-expand-all  是否默认展开所有节点-->
      <el-tree
        :data="rightsList"
        show-checkbox
        :default-expand-all="true"
        :default-checked-keys="checkedRights"
        node-key="id"
        ref="rightsTree"
        :props="defaultProps"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isAssainRightDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="updateRoleRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      roseList: [],
      isAssainRightDialogShow: false,
      rightsList: [],
      // 这个是用来设置 tree组件的 数据展示 子节点以及 展示的文字的
      defaultProps: {
        // 子级元素属性名
        children: "children",
        // 当前节点展示的文字的属性名
        label: "authName"
      },
      checkedRights : [],
      currentEditRoleId : -1,
    };
  },
  methods: {

    // 标签删除
    async deleteRight(row,id){
      console.log("删除单个元素")
      // 调用接口，删除当前角色指定的权限信息

      // 接口信息
      //  roles/:id/rights/:rightID
      // method: delete
      let res = await this.$http({
        url : `roles/${row.id}/rights/${id}`,
        method : "delete"
      });

      console.log(res)

      if(res.data.meta.status == 200){
        this.$message({
          type : "success",
          message : res.data.meta.msg,
          duration : 1000
        });

        this.getRoleList( () => {
          this.$nextTick(() => {
           //让表格对应的项展开即可
            this.$refs.roleTable.toggleRowExpansion(
              this.roseList.find(v => v.id == row.id),
              true
            )
          })
        })
      }
    },


    // 点击确定
    async updateRoleRights (){
      // 1. 获取tree组件中，所有被勾选的节点的id
  
      let ids = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys(),
      ].join(",")
      // 2. 将id拼接成字符串之后，发送ajax请求，修改角色权限
      let res = await this.$http({
        url : `roles/${this.currentEditRoleId}/rights`,
        method : "post",
        data : {
          rids : ids
        },
      });
      // 弹出提示框
      this.$message({
        type : "success",
        message : res.data.meta.msg,
        duration : 1000
      });
      // 重新渲染数据
      this.getRoleList();

      // 关闭模态框
      this.isAssainRightDialogShow= false;
    },


  
    // 模态框功能
    async showAssainRightsDialog(row) {
      // 当前currentEditRoleId为rold的id
      this.currentEditRoleId = row.id
      // console.log(11)
      // 显示模态框
      this.isAssainRightDialogShow = true;
      // 获取数据
      let res = await this.$http({
        url: "rights/tree"
      });
      // 把权限列表绑定给了tree组件
      this.rightsList = res.data.data;
      console.log(res);

      // 4. 需要让tree组件中默认选中当前角色拥有的权限信息
      // checkedRights ： 我们需要把当前角色row中所有的权限的id，组合成一个数组，赋值给checkedRights
      // console.log(row);
      // 获取一级权限的id，组合成数组
      let level1Ids = [];
      // 获取二级权限的id，组合成数组
      let level2Ids = [];
      // 获取三级权限的id，组合成数组
      let level3Ids = [];
      row.children.forEach(level1 => {
        level1Ids.push(level1.id);
        level1.children.forEach(level2 => {
          level2Ids.push(level2.id);
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id);
          });
        });
      });

      this.checkedRights = [...level1Ids , ...level2Ids , ...level3Ids]
    },

    async getRoleList(){
    let res = await this.$http({
      url: "roles"
    });
    // console.log(res);
    this.roseList = res.data.data;
    }
  },
 created() {
    this.getRoleList();
  }
};
</script>



<style scoped>
.el-breadcrumb.el-breadcrumb {
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  font-size: 16px;
  background-color: cyan;
}
.level1 {
  padding: 10px 0;
  border-bottom: 1px dashed #ccc;
}
.level1:last-child {
  border-bottom: none;
}
.level2 {
  margin-bottom: 15px;
}
.level3 {
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
