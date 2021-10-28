<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 提示框 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>

          <!-- 选择商品分类的级联选择器 -->
          <el-cascader
            popper-class="cascader"
            expand-trigger="hover"
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tag页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            @click="addDialogVisible = true"
            type="primary"
            size="mini"
            :disabled="this.selectedCateKeys.length === 3 ? false : true"
            >添加参数</el-button
          >

          <!-- 动态参数表格 -->
          <el-table :data="manyTableDate" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope" class="template">
                <div class="expand">
                <el-tag
                  closable
                  disable-transitions
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tags"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                ></div>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button
            @click="addDialogVisible = true"
            type="primary"
            size="mini"
            :disabled="this.selectedCateKeys.length === 3 ? false : true"
            >添加属性</el-button
          >

          <!-- 静态参数表格 -->
          <el-table :data="onlyTableDate" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand" >
              <template slot-scope="scope">
                <el-tag
                  closable
                  disable-transitions
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tags"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      @close="addDialogClosed"
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <!-- 添加参数表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name" @change="addParams"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      @close="editDialogClosed"
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 添加参数表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input
            v-model="editForm.attr_name"
            @change="eidtParams"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MyParams",

  data() {
    return {
      /* 接收商品分类的信息 */
      cateList: [],

      /* 接收动态参数的信息 */
      manyTableDate: [],

      /* 接收静态参数的信息 */
      onlyTableDate: [],

      /* 级联选择框双向绑定到的数组 */
      selectedCateKeys: [],

      /* 级联选择框的配置选项 */
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      /* tab页签激活状态 */
      activeName: "many",

      /* 控制添加参数对话框的显示与隐藏 */
      addDialogVisible: false,

      /* 控制编辑参数对话框的显示与隐藏 */
      editDialogVisible: false,

      /* 添加参数的表单对象 */
      addForm: {
        attr_name: "",
      },

      /* 编辑参数的表单对象 */
      editForm: {
        attr_name: "",
      },

      /* 添加参数表单的验证规则 */
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      /* 编辑参数表单的验证规则 */
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getCateList();
  },

  methods: {
    /* 获取商品分类的信息 */
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        this.$message.error("获取商品分类数据失败");
      }
      this.cateList = res.data;
    },

    /* 级联选择框选中项变化，会触发这个函数 */
    handleChange() {
      this.getParamsData();
    },

    /* Tab页签点击页签的处理函数 */
    handleTabClick() {
      this.getParamsData();
    },

    /* 获取参数列表 */
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      /* 根虎所选的分类ID，和当前所处的面板，获取对应的参数 */
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      /* 判断item.attr_vals是否为空，否的话直接是空数组 */
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals
          ? (item.attr_vals = item.attr_vals.split(","))
          : [];
        /* 控制文本框的显示与隐藏 */
        item.inputVisible = false;
        /* 文本框中输入的值 */
        item.inputValue = "";
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取商品分类数据失败");
      }
      if (this.activeName === "many") {
        this.manyTableDate = res.data;
      } else {
        this.onlyTableDate = res.data;
      }
    },

    /* 监听添加参数对话框关闭后的对话框清空数据 */
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    /* 监听编辑参数对话框关闭后的对话框清空数据 */
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    /* 添加参数确定的提交 */
    addParams() {
      /* 预校验 */
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 201) {
          return this.$notify({
            title: "失败",
            message: res.meta.msg,
            type: "error",
          });
        } else {
          this.addDialogVisible = false;
          this.getParamsData();
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
          });
        }
      });
    },

    /* 点击编辑按钮展示对应的对话框 */
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取" + this.titleText + "失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    /* 编辑对话框的确定编辑修改参数信息 */
    eidtParams() {
      /* 预验证 */
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) {
          return this.$notify({
            title: "失败",
            message: res.meta.msg,
            type: "error",
          });
        } else {
          this.editDialogVisible = false;
          this.getParamsData();
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
          });
        }
      });
    },

    /* 点击删除参数按钮 */
    async deleteParams(attr_id) {
      const confirmResult = await this.$confirm(
        "'此操作将永久删除该" + this.titleText + ", 是否继续?",
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
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$notify({
          title: "删除失败",
          message: res.meta.msg,
          type: "error",
        });
      }

      this.$notify({
        title: "成功",
        message: "删除" + this.titleText + "成功",
        type: "success",
      });
      this.getParamsData();
    },

    /* 标签关闭触发 */
    handleClose(i,row) {
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row);
    },

    /* 文本框失去焦点或回车键触发的事件 */
     handleInputConfirm(row) {
      /* 证明用户输入的内容为空 */
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      /* 证明输入的内容有效 */
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
      this.getParamsData();
    },

/* 将对attr_ vals的操作保存到数据库中 */
async saveAttrVals(row) {
    const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(","),
        }
      );
      if (res.meta.status !== 200) {
        return this.$notify({
          title: "添加失败",
          message: res.meta.msg,
          type: "error",
        });
      }
      this.$notify({
        title: "成功",
        message: "添加Tag成功成功",
        type: "success",
      });
},
    /* 点击标签Tag的按钮显示文本框 */
    showInput(row) {
      row.inputVisible = true;
      /* 让文本框自动获得焦点 */
      this.$nextTick((_) => {
        /*$nextTick 是当页面上元素被重新渲染之后才可以调用refs*/
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },

  computed: {
    /* 获取选中的三级分类的ID值 */
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },

    /* 对话框是否是动态还是静态 */
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
  margin-bottom: 15px;
}
.el-cascader-panel {
  height: 500px;
}
.el-table {
  margin-top: 15px;
}

.el-tag {
  margin-right: 20px;
}

.input-new-tags {
  width: 86.813px;
}
.expand {
  display: flex;
  padding: 0 40px;
  justify-content: left;
}
</style>