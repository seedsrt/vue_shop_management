<template>
  <div>
    <!-- 面板屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="showAddCareDialog">添加分类</el-button>

      <!-- 表格区域 -->
      <tree-table
        class="tree-table"
        :data="categoriesList.result"
        show-index
        index-text="#"
        show-row-hover
        border
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效的作用域插槽 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted !== false"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>

        <!-- 排序的作用域插槽 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else-if="scope.row.cat_level === 2" type="warning"
            >三级</el-tag
          >
        </template>

        <!-- 操作的作用域插槽 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfor.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="querInfor.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 点击添加分类按钮的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            class="el-cascader"
            check-strictly
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击编辑分类按钮的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MyCategories",
  data() {
    return {
      /* 查询条件 */
      querInfor: {
        type: 3,
        /* 获取页码数 */
        pagenum: 1,
        /* 每页显示多少条数据 */
        pagesize: 10,
      },

      /* 商品分类的总数 */
      total: 0,

      /* 存放商品分类数据 */
      categoriesList: [],

      /* 为table指定列的含义 */
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],

      /* 点击添加分类按钮的对话框的显示与隐藏 */
      addCateDialogVisible: false,

      /* 点击编辑分类按钮的对话框的显示鱼隐藏 */
      editCateDialogVisible: false,

      /* 点击删除分类按钮的对话框的显示鱼隐藏 */
      delectCateDialogVisible: false,

      /* 添加分类的表单数据对象 */
      addCateForm: {
        /* 父级分类的ID */
        cat_pid: 0,
        /* 分类名称 */
        cat_name: "",
        /* 分类的级别 */
        cat_level: 0,
      },

      /* 编辑分类的表单数据 */
      editCateForm: {},

      /* 添加分类的校验规则 */
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类的名称", trigger: "blur" },
        ],
      },

      /* 编辑分类的校验规则 */
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类的名称", trigger: "blur" },
        ],
      },

      /* 父级分类的列表数据 */
      parentCateList: [],

      /* 指定级联选择器的配置对象 */
      cascaderProps: {
        /* 指定选项的值为选项对象的某个属性值 */
        value: "cat_id",
        /* 指定选项标签为选项对象的某个属性值 */
        label: "cat_name",
        /* 指定选项的子选项为选项对象的某个属性值 */
        children: "children",
        checkStrictly: true,
      },

      /* 选中的父级分类的ID数组 */
      selectedKeys: [],
    };
  },

  created() {
    this.getCategoriesList();
  },

  methods: {
    /* 获取商品分类的数据 */
    async getCategoriesList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfor,
      });
      if (res.meta.status !== 200) {
        this.$notify({
          title: "失败",
          message: "获取商品分类数据失败",
          type: "error",
        });
      }
      this.categoriesList = res.data;
      this.total = res.data.total;
    },

    /* 监听pagesize改变 */
    handleSizeChange(newSize) {
      this.querInfor.pagesize = newSize;
      this.getCategoriesList();
    },

    /* 监听pagenum改变 */
    handleCurrentChange(newPage) {
      this.querInfor.pagenum = newPage;
      this.getCategoriesList();
    },

    /* 点击添加分类按钮 展示添加分类的对话框 */
    showAddCareDialog() {
      this.addCateDialogVisible = true;
      this.getParentCateList();
    },

    /* 获取父级分类的列表数据 */
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类列表数据失败");
      }
      this.parentCateList = res.data;
    },

    /* 当选中节点变化时触发这个函数 */
    parentCateChange() {
      /* 如果selectedKeys数组中的长度lenght 大于0 说明选到父级的分类 否则没选中 */
      if (this.selectedKeys.length > 0) {
        /* 父级分类的id */
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        /* 为当前分类的等级赋值 */
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    /* 点击添加分类的确认按钮事件 */
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 200) {
          this.$notify.error({
            title: "失败",
            message: "添加分类失败",
          });
        }
        this.$notify({
          title: "成功",
          message: "添加分类成功",
          type: "success",
        });
        this.getCategoriesList();
        this.addCateDialogVisible = false;
      });
    },

    /* 展示编辑分类的对话框 */
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${id}`);
      if (res.meta.status !== 200) {
        return this.$notify({
          title: "失败",
          message: "查询用户列表失败",
          type: "error",
        });
      }
      this.editCateForm = res.data;
      this.editCateDialogVisible = true;
    },

    /* 监听添加分类按钮关闭后的对话框清空数据 */
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.selectedKeys = [];
    },

    /* 点击按钮修改用户*/
    editCateInfor() {
      /* 预验证 */
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "categories/" + this.editCateForm.cat_id,
          { cat_name: this.editCateForm.cat_name }
        );
        if (res.meta.status !== 200) {
          return this.$notify({
            title: "失败",
            message: res.meta.msg,
            type: "error",
          });
        } else {
          this.editCateDialogVisible = false;
          this.getCategoriesList();
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
          });
        }
      });
    },

    /* 点击按钮删除商品分类 */
    async removeCateById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$notify({
          title: "删除失败",
          message: res.meta.msg,
          type: "error",
        });
      }

      this.$notify({
        title: "成功",
        message: "删除用户成功",
        type: "success",
      });
      this.getCategoriesList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
.tree-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
  height: auto;
}
</style>