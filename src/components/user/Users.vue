<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @change="getUserList"
            @clear="getUserList"
            clearable
          >
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <template>
        <el-table :data="userlist" stripe style="width: 100%" border>
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            width="180"
            :formatter="formatrDate"
          >
          </el-table-column>
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="role_name" label="角色" width="180">
          </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="手机号"> </el-table-column>
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStateChange(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="修改"
                placement="top"
                :enterable="false"
              >
                <el-button
                  @click="showEditDialog(scope.row.id)"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
              </el-tooltip>

              <!-- 删除按钮 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeUserById(scope.row.id)"
                ></el-button>
              </el-tooltip>

              <!-- 分配角色按钮 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-s-custom"
                  circle
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
        :close-on-click-modal="false"
      >
        <!-- 添加用户的对话框主题区 -->
        <el-form
          :model="addForm"
          status-icon
          :rules="addFormRules"
          ref="addFormRef"
          label-width="auto"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="addForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              show-password
              type="password"
              v-model="addForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPwd">
            <el-input
              show-password
              type="password"
              v-model="addForm.checkPwd"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="text"
              v-model="addForm.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input
              type="text"
              v-model="addForm.mobile"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部的按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        @close="editDialogClosed"
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        :close-on-click-modal="false"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" :disabled="true"> </el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfor">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="setRoleDialogClosed"
      >
        <div>
          <p>当前的用户：{{ userInfor.username }}</p>
          <p>当前的角色：{{ userInfor.role_name }}</p>
          <p>
            分配新角色：
            <el-select v-model="selectRoledId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfor">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "MyUser",
  data() {
    /* 验证邮箱 */
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/;
      if (regEmail.test(value)) {
        callback();
      } else {
        callback(new Error("请输入合法的邮箱"));
      }
    };

    /* 验证手机 */
    var checkMobile = (rule, value, callback) => {
      const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入合法的手机号"));
      }
    };

    /* 再次确认密码 */
    var checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    
    return {
      //获取用户列表参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },

      /* 存储用户列表信息 */
      userlist: [],

      /* 用户总个数 */
      total: 0,

      /* 控制添加用户对话框的显示与隐藏 */
      addDialogVisible: false,

      /* 控制修改用户对话框的显示与隐藏 */
      editDialogVisible: false,

      /* 控制分配角色对话框的显示与隐藏 */
      setRoleDialogVisible: false,

      /* 需要被分配角色的用户信息 */
      userInfor: "",

      /* 获取所以角色的数据列表 */
      roleList: [],

      /* 已选择的角色ID值 */
      selectRoledId: "",

      /* 储存添加用户的表单数据 */
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },

      /* 添加用户表单的校验规则 */
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        checkPwd: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: checkPassword, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入用户手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      /* 用于存储修改的用户对象 */
      editForm: {},

      /* 修改用户表单的校验规则 */
      editFormRules: {
        email: [
          { required: true, message: "请输入用户的邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入用户的手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    /* 获取用户列表信息 */
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },

    /* 监听pagesize改变的事件 */
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getUserList();
    },

    /* 监听页码值改变 */
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getUserList();
    },

    /* 监听Swich开关的状态变化 */
    async userStateChange(userinfor) {
      const { data: res } = await this.$http.put(
        `users/${userinfor.id}/state/${userinfor.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfor.mg_state = !userinfor.mg_state;
        return this.$notify.error({
          title: "错误",
          message: "更新用户状态失败",
        });
      }
      this.$notify({
        title: "成功",
        message: "更新用户状态成功",
        type: "success",
      });
    },

    /* 时间格式化 */
    formatrDate(value) {
      let dataValue = this.dayjs(value.create_time * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return dataValue;
    },

    /* 监听添加用户对话框的关闭清空添加表单信息的事件 */
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    /* 点击按钮添加用户*/
    addUser() {
      /* 预验证 */
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        /* 添加网络请求 */
        const { data: res } = await this.$http.post("users", this.addForm);
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
        this.addDialogVisible = false;
        this.getUserList();
      });
    },

    /* 展示修改用户的对话框 */
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$notify({
          title: "失败",
          message: "查询用户列表失败",
          type: "error",
        });
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    /* 监听修改用户对话框的关闭清空添加表单信息的事件 */
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    /* 点击按钮修改用户*/
    editUserInfor() {
      /* 预验证 */
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );
        if (res.meta.status !== 200) {
          return this.$notify({
            title: "失败",
            message: res.meta.msg,
            type: "error",
          });
        } else {
          this.editDialogVisible = false;
          this.getUserList();
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
          });
        }
      });
    },

    /* 根据ID删除用户信息的事件 */
    async removeUserById(id) {
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
      const { data: res } = await this.$http.delete("users/" + id);
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
      this.getUserList();
    },

    /* 展示分配角色的对话框 */
    async setRole(userinfor) {
      this.userInfor = userinfor;

      /* 在展示对话框之前，获取角色列表 */
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
      this.setRoleDialogVisible = true;
    },

    /* 点击确认分配角色 */
    async saveRoleInfor() {
      if (!this.selectRoledId) {
        return this.$notify.error({
          title: "错误",
          message: "清选择要分配的角色！",
        });
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfor.id}/role`,
        { rid: this.selectRoledId }
      );
      if (res.meta.status !== 200) {
        return this.$notify.error({
          title: "失败",
          message: "分配用户角色失败",
        });
      }
      this.$notify({
        title: "成功",
        message: "分配用户角色成功",
        type: "success",
      });
      this.getUserList();
      this.setRoleDialogVisible = false;
    },

    /* 监听分配角色对话框关闭的事件，清空之前的选择 */
    setRoleDialogClosed() {
      this.userInfor = "";
      this.selectRoledId = "";
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>