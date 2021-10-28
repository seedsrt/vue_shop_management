<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avater_box">
        <img src="../assets/img/Head_portrait.jpg" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="ruleFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="0px"
        class="login_from"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyLogin",
  data() {
    return {
      //登录表单数据绑定的对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //表单的验证规则对象
      rules: {
        //账号验证
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        //密码验证
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        this.$message.success("登录成功");
        window.sessionStorage.setItem("token", res.data.token);
        window.sessionStorage.setItem("User", this.loginForm.username);
        this.$router.push('/home')
      });
    },
    resetForm() {
      (this.loginForm.username = ""), (this.loginForm.password = "");
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(48, 49, 56);
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avater_box {
      position: absolute;
      top: -20%;
      left: 50%;
      transform: translateX(-50%);
      height: 130px;
      width: 130px;
      overflow: hidden;
      border-radius: 50%;
      border: 1px solid rgb(128, 128, 128);
      box-shadow: 0 0 10px #ddd;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.login_from {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0 40px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>