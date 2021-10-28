<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权利管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button type="primary" round @click="addRolesVisible = true"
        >添加角色</el-button
      >

      <!-- 表格区域 -->
      <el-table :data="roleList" stripe style="width: 100%" border>
        <!-- 展开列 -->
        <el-table-column type="expand" label="详细" width="60">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col class="tag1" :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#" width="60"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="auto">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="auto">
        </el-table-column>
        <el-table-column label="操作" width="400">
          <!-- 按钮区 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showRolesDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户的对话框主题区 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addRolesVisible"
      width="50%"
      @close="addRolesClosed"
      :close-on-click-modal="false"
    >
      <!-- 添加用户的表单 -->
      <el-form :model="addForm" status-icon ref="addFormRef" label-width="auto">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            type="text"
            v-model="addForm.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            type="text"
            v-model="addForm.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部的按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog
      @close="rolesDialogClosed"
      title="修改用户信息"
      :visible.sync="rolesDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="roleForm" ref="editFormRef" label-width="70px">
        <el-form-item label="角色ID">
          <el-input v-model="roleForm.roleId" :disabled="true"> </el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName"> </el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 对话框底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleInfor">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
    >
      <!-- 树形空间 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        :default-checked-keys="defKeys"
        show-checkbox
        node-key="id"
        default-expand-all
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MyRoles",

  data() {
    return {
      /* 所以角色列表数据 */
      roleList: [],

      /* 所以权限的数据 */
      rightsList: [],

      /* 默认选中的节点ID值数组 */
      defKeys: [],

      /* 当前即将分配权限角色的ID */
      roleId: "",

      /* 控制添加角色对话框的显示与隐藏 */
      addRolesVisible: false,

      /* 控制修改角色对话框的显示与隐藏 */
      rolesDialogVisible: false,

      /* 控制分配权限对话框的显示与隐藏 */
      setRightDialogVisible: false,

      /* 储存添加角色的表单数据 */
      addForm: {
        roleName: "",
        roleDesc: "",
      },

      /* 储存修改角色的表单数据 */
      roleForm: {},

      /* 树形控件的属性绑定对象 */
      treeProps: {
        children: "children",
        label: "authName",
      },
    };
  },

  created() {
    this.getRolesList();
  },

  methods: {
    /* 表格数据获取 */
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.roleList = res.data;
    },

    /* 点击按钮添加用户 */
    async addUser() {
      const { data: res } = await this.$http.post("roles", this.addForm);
      if (res.meta.status !== 201) {
        this.$notify({
          title: "失败",
          message: res.meta.msg,
          type: "error",
        });
        return;
      } else {
        this.$notify({
          title: "成功",
          message: "添加成功",
          type: "success",
        });
      }
      /* 隐藏对话框 */
      this.addRolesVisible = false;
      this.getRolesList();
    },

    /* 监听添加角色对话框的关闭清空添加表单信息的事件 */
    addRolesClosed() {
      this.$refs.addFormRef.resetFields();
    },

    /* 监听修改角色对话框的关闭清空添加表单信息的事件 */
    rolesDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    /* 根据ID删除角色信息的事件 */
    async removeRolesById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      const { data: res } = await this.$http.delete("roles/" + id);
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
      this.getRolesList();
    },

    /* 展示编辑角色的对话框 */
    async showRolesDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$notify({
          title: "失败",
          message: "查询用户列表失败",
          type: "error",
        });
      }
      this.roleForm = res.data;
      this.rolesDialogVisible = true;
    },

    /* 点击按钮修改角色信息 */
    async roleInfor() {
      const { data: res } = await this.$http.put(
        "roles/" + this.roleForm.roleId,
        {
          roleName: this.roleForm.roleName,
          roleDesc: this.roleForm.roleDesc,
        }
      );
      if (res.meta.status !== 200) {
        return this.$notify({
          title: "失败",
          message: res.meta.msg,
          type: "error",
        });
      } else {
        this.rolesDialogVisible = false;
        this.getRolesList();
        this.$notify({
          title: "成功",
          message: "添加成功",
          type: "success",
        });
      }
    },

    /* 根据ID删除对应的权限 */
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$notify.error({
          title: "错误",
          message: "删除对应的权限失败",
        });
      }
      role.children = res.data;
    },

    /* 展示分配权限的对话框 */
    async showSetRightDialog(role) {
      this.roleId = role.id;
      /* 获取所以权限列表 */
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.rightsList = res.data;

      //递归获取三级节点的ID
      this.getLeafKeys(role, this.defKeys);

      this.setRightDialogVisible = true;
    },

    /* 通过递归的形式，获取角色下所以权限的ID，并保存在defKeys */
    getLeafKeys(node, arr) {
      /* 如果当前node节点不包含children属性，则是三级节点 */
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },

    /* 监听分配权限对话框的关闭事件 */
    setRightDialogClosed() {
      this.defKeys = [];
    },

    /* 点击确认角色分配权限 */
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      if (res.meta.status !== 200) {
        return this.$notify({
          title: "失败",
          message: res.meta.message,
          type: "error",
        });
      }
      this.$notify({
        title: "成功",
        message: "添加成功",
        type: "success",
      });
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
  padding: 20px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-row {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>