<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 信息框 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条 -->
      <!-- activeIndex-0可转换成数字类型 -->
      <el-steps
        space="100%"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tabs标签页区域 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name"
              ><el-input v-model="addForm.goods_name"></el-input
            ></el-form-item>
            <el-form-item label="商品价格" prop="goods_price"
              ><el-input v-model="addForm.goods_price" type="number"></el-input
            ></el-form-item>
            <el-form-item label="商品重量" prop="goods_weight"
              ><el-input v-model="addForm.goods_weight" type="number"></el-input
            ></el-form-item>
            <el-form-item label="商品数量" prop="goods_number"
              ><el-input v-model="addForm.goods_number" type="number"></el-input
            ></el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="CateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader
              ><el-button type="primary" class="nextBtn" @click="next"
                >下一步</el-button
              >
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <!-- 商品参数渲染表单的Item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  size="small"
                  :label="items"
                  v-for="(items, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- 商品参数按钮 -->
            <div style="heigh: 100px">
              <el-button type="primary" class="Btn" @click="next"
                >下一步</el-button
              >
              <el-button type="primary" class="Btn" @click="prev"
                >上一步</el-button
              >
            </div>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <!-- 商品属性表单 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
            <!-- 商品属性按钮 -->
            <div style="heigh: 100px">
              <el-button type="primary" class="Btn" @click="next"
                >下一步</el-button
              >
              <el-button
                type="primary"
                class="Btn"
                @click="prev"
                style="right: 500px"
                >上一步</el-button
              >
            </div></el-tab-pane
          >
          <el-tab-pane name="3" label="商品图片">
            <!-- action图片上传的api地址 -->
            <el-upload
              :on-success="headerSuccess"
              :headers="headersObj"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
            <!-- 商品图片按钮 -->
            <div style="heigh: 100px">
              <el-button type="primary" class="Btn" @click="next"
                >下一步</el-button
              >
              <el-button
                type="primary"
                class="Btn"
                @click="prev"
                style="right: 500px"
                >上一步</el-button
              >
            </div></el-tab-pane
          >
          <el-tab-pane name="4" label="商品内容"
            ><div style="heigh: 100px">
              <quill-editor
                ref="myQuillEditor"
                v-model="addForm.goods_intriduce"
              />
              <el-button
                type="primary"
                class="Btn"
                @click="add"
                style="right: 500px"
                >提交</el-button
              >
              <el-button
                type="primary"
                class="Btn"
                @click="prev"
                style="right: 500px"
                >上一步</el-button
              >
            </div></el-tab-pane
          >
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片详情对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="PreviewPath" class="previewImg" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash' //导入lodash
export default {
  name: "MyAdd",
  data() {
    return {
      /* 接收商品分类数据 */
      CateList: [],
      /* 步骤条的激活 */
      activeIndex: "0",
      /* 添加商品的表单对象 */
      addForm: {
        goods_name: "",
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        //商品所属的分类数组
        goods_cat: [],
        //图片的数组
        pics: [],
        //商品的详情描述
        goods_intriduce: "",
        attrs:[]
      },

      /* 表单内容 */
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      /* 接收商品参数的tags标签 */
      manyTableData: [],

      /* 接收商品属性的tags标签 */
      onlyTableData: [],

      /* 添加商品的校验规则 */
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },

      /* upload上传图片的url地址 */
      uploadURL: "https://lianghj.top:8888/api/private/v1/upload",
      /* 图片组件上传的请求头对象 */
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      /* 图片的url地址 */
      PreviewPath: "",

      /* 图片详情对话框的显示与隐藏 */
      previewDialogVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    /* 获取所以商品分类的数据 */
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败");
      }
      this.CateList = res.data;
    },

    /* 级联选择器选中项变化会触发函数 */
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        this.$message({
          message: "请选择三级分类",
          type: "warning",
        });
      }
    },

    /* 切换tabs时的判断事件 */
    beforeTabLeave(activeName, oldActiveName) {
      let isSwitch = false; //判断是否能切换
      /* 校验规则 */
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请完成必填项");
          return false;
        }
        isSwitch = true;
      });
      return isSwitch;
    },

    /* tab 被选中时触发 */
    async tabClick() {
      /* 证明访问的是动态参数面板 */
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("获取动态参数面板失败");
        }
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals
            ? (item.attr_vals = item.attr_vals.split(","))
            : [];
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        /* 证明访问商品属性面板 */
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("获取动态参数面板失败");
        }
        this.onlyTableData = res.data;
      }
    },

    /* 上一步 */
    prev() {
      this.activeIndex = this.activeIndex - 0 - 1 + "";
    },
    /* 下一步 */
    next() {
      if (this.beforeTabLeave() === true) {
        this.activeIndex = this.activeIndex - 0 + 1 + "";
        this.tabClick();
      }
    },

    /* 处理图片预览效果 */
    handlePreview(file) {
      this.PreviewPath = file.response.data.url;
      this.previewDialogVisible = true;
    },

    /* 处理移除图片的操作 */
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath); //找到与filePath相同的索引值保存到i上
      this.addForm.pics.splice(i, 1);
    },

    /* 监听图片上传成功的事件 */
    headerSuccess(response) {
      const picInfor = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfor);
    },
    /* 提交添加商品 */
     add() {
      this.$refs.addFormRef.validate( async(valid) =>{
        if(!valid) {
          return this.$message.error('请填写必要的表单项信息')
        }
        /* 执行添加 */
       const form = _.cloneDeep(this.addForm)//用深拷贝不用直接操作到data上
       form.goods_cat=form.goods_cat.join(',')
       /* 处理动态参数 */
       this.manyTableData.forEach(item => {
         const newInfo = {
           attr_id:item.attr_id,
           attr_value:item.attr_vals.join(',')
         }
         this.addForm.attrs.push(newInfo)
       })
       /* 处理商品属性 */
       this.onlyTableData.forEach(item => {
         const newInfo = {
           attr_id:item.attr_id,
           attr_value:item.attr_vals
         }
         this.addForm.attrs.push(newInfo)
       })
       form.attrs = this.addForm.attrs
       /* 发起请求 */
       const {data:res} = await this.$http.post('goods',form) 
       if(res.meta.status!==201){
         return  this.$notify.error({
          title: '失败',
          message: '添加商品失败'
        });
       }
       this.$notify({
          title: '成功',
          message: '添加商品成功',
          type: 'success'
        });
        this.$router.push('/goods')
      })
    }
  },

  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-tabs {
  margin: 30px 0;
}
.el-button {
  float: right;
  margin-right: 20px;
  margin-top: 20px;
}
.el-checkbox {
  margin: 0 20px 0 0 !important;
}
.previewImg {
  width: 100%;
}
</style>