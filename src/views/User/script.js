
export default {
  data() {
    return {
      userList: [],
      total: 0,
      pagesize: 3,
      currentpage: 1,
      keyword: "",
      isAddUserDialogShow: false,
      // 添加用户数据
      addUserFormData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户校验规则
      addUserRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      },
      // 修改用户数据
      editUserFormData : {
        id : 0,
        username : "",
        email : "",
        mobile : ""
      },
      isEditUserDialogShow :false,
      // 修改数据表单校验
      editUserRules: {
        email : [
          
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
          
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]

      }
    };
  },
  // 发送ajax请求
  created() {
    this.getUserList();
  },

  methods: {
    getUserList() {
      this.$http({
        // 地址
        url: "users",
        params: {
          query: this.keyword,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        },
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
      let res = await this.$http({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: "put",
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
        let res = await this.$http({
          url: `users/${id}`,
          method: "delete",
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
    //添加模态框
    openAddUserDialog() {
      this.isAddUserDialogShow = true;
    },
    // 添加功能
    async addUser() {
      // 成功函数
      try {
        await this.$refs.addUserForm.validate();
        // 发送ajax请求
        let res = await this.$http({
          // 地址
          url: "users",
          // 请求方式
          method: "post",
          // 数据为当前表格数据
          data: this.addUserFormData,
        });
        // 数据请求成功
        if (res.data.meta.status == 201) {
          // 弹出成功提示
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          // 重新渲染页面
          this.getUserList();
          // 模态框隐藏
          this.isAddUserDialogShow = false;
        } else {
          // 数据请求失败 弹出失败提示
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } 
      // 失败
      catch (err) {}
    },
    //修改功能
    async openEditUserDialog(id){
      // 1.打开模态框
      this.isEditUserDialogShow=true;
      // 2.用id去后台获取数据。展示到模态框  
      // 发送ajax
      let res = await this.$http ({
        url : `users/${id}`,
      })
      // 模态框内容为当前的数据
      this.editUserFormData = res.data.data;
    },
    async editUser (){
      
      // 成功时
      try{

        await this.$refs.editUserForm.validate()

        // 向后台请求数据
        let res =  await this.$http ({
          // 地址id为当前当前模态框的id
          url : `users/${this.editUserFormData.id}`,
          // 请求方式
          method : "put",
          // 数据为当前修改后的数据
          data :{
            mobile : this.editUserFormData.mobile,
            email : this.editUserFormData.email,
          }
        })
        if(res.data.meta.status == 200){
          // 提醒用户更新成功
          this.$message({
            type : "success",
            message : res.data.meta.msg,
            duration : 1000
          })
          //重新渲染页面
          this.getUserList();
          // 模态框隐藏
          this.isEditUserDialogShow=false;
        }else{
          // 提醒用户错误
          this.$message({
            type : "erros",
            message : res.data.meta.msg,
            duration : 1000
          })
        }

      }catch(err){

      }
    }
  }
};