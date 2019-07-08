<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- tab步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>

    <!-- 步骤条 -->
    <!-- v-model="activeName" v-model属性用来绑定 当前正在激活的标签的name -->
    <!-- value可以实现，标签切换 -->
    <el-tabs tab-position="left" style="marginTop:20px;" @tab-click="changeTab" v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <!-- 基本信息页 -->
        <el-form ref="form" :model="addGoodsFormData" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsFormData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsFormData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsFormData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsFormData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateOptions"
              :props="defaultProps"
              v-model="addGoodsFormData.catArr"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="是否促销">
            <el-radio-group v-model="addGoodsFormData.is_promote">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-button type="primary" @click="next(1,'pic')">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <!-- 上传图片 -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-success="onFileUploadSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content" style="height: 400px;">
        <quill-editor v-model="addGoodsFormData.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>

    <!-- 下一步按钮 -->
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      active: 0,
      activeName: "basic",
      addGoodsFormData: {
        goods_name: "",
        catArr : [],
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        is_promote: "",
        goods_introduce: ""
      },
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  async created() {
    let res = await this.$http({
      url: "categories",
      parame: {
        type: 3
      }
    });

    // console.log(res)
    this.cateOptions = res.data.data;
  },
  methods: {
    // 上传图片的临时路径
    onFileUploadSuccess(res) {
      // console.log(res)
      this.addGoodsFormData.pics.push({
        pic: res.data.tmp_path
      });
    },

    // 关联按钮、tab导航条和左侧导航条
    next(index, activeName) {
      this.active = index;
      this.activeName = activeName;
    },
    changeTab(tab) {
      // console.log(tab);
      this.active = +tab.index;
    },
    // 完成发送请求数据，提交后台
    async addGoods() {
      let newGoods = {
        goods_cat : this.addGoodsFormData.catArr.join(),
        goods_name: this.addGoodsFormData.goods_name,
        goods_price: this.addGoodsFormData.goods_price,
        goods_number: this.addGoodsFormData.goods_number,
        goods_weight: this.addGoodsFormData.goods_weight,
        goods_introduce:this.addGoodsFormData.goods_introduce,
        pics: this.addGoodsFormData.pics,
        is_promote: this.addGoodsFormData.is_promote,
      };

      let res = await this.$http({
        url : "goods",
        method : "post",
        data : newGoods
      });
      console.log(res)
      // // 添加成功后渲染页面
      if(res.data.meta.status == 201){
        this.$router.push("/goods")
      } else {
        this.$message({
          type : "error",
          message:res.data.meta.msg,
          duration : 1000
        })
      }
    }
  }
};
</script>

<style >
.ql-container{
    height: 150px;
  }
</style>
