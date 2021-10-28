<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div class="logo">
        <img
          class="Head_portrait"
          src="../assets/img/Head_portrait.jpg"
          alt=""
        />
        <span>电商管理平台</span>
      </div>
      <el-button
        type="info"
        size="mini"
        round
        icon="el-icon-position"
        @click="back"
        >退出登录</el-button
      >
    </el-header>

    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单 -->

        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          router
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#303138"
          text-color="#fff"
          active-text-color="#409EEF"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              @click="saveNavState('/' + subItem.path)"
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsChildrenObj[subItem.id]"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主题内容 -->
      <el-main>
        <!-- 通过路由规则渲染 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "MyHome",

  data() {
    return {
      /* 菜单列表数据 */
      menulist: {},

      /* 一级菜单图标渲染 */
      iconsObj: {
        125: "iconfont icon-yonghuguanli",
        103: "iconfont icon-quanxianguanli",
        101: "iconfont icon-shangpinguanli",
        102: "iconfont icon-dingdanguanli",
        145: "iconfont icon-shujutongji",
      },

      /* 二级菜单图标渲染 */
      iconsChildrenObj: {
        110: "iconfont icon-yonghuliebiao",
        111: "iconfont icon-jiaoseliebiao",
        112: "iconfont icon-zhanghaoquanxianguanli",
        104: "iconfont icon-fenxiaoshangpinliebiao",
        115: "iconfont icon-fenlei",
        121: "iconfont icon-shangpinfenlei",
        107: "iconfont icon-dingdanliebiao",
        146: "iconfont icon-shujubaobiao",
      },

      /* 折叠菜单 */
      isCollapse: false,

      /* 接受被激活的链接 */
      activePath: "",
    };
  },

  created() {
    this.getMenuList();
    /* 获取activePath的值，实现页面的跳转 */
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    /* 退出登录 */
    back() {
      this.$confirm("确认是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.sessionStorage.clear();
        this.$router.push("/login");
        this.$notify({
          title: "成功",
          message: "退出成功",
          type: "success",
        });
      });
    },

    /* 获取所以菜单 */
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
    },

    /* 点击按钮收缩菜单 */
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    /* 保存链接激活状态 */
    saveNavState(activePath) {
      window.sessionStorage.setItem("acitvePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #303138;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  padding-left: 0;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    img {
      /* 去除旋转时候出现的边框 是一个子像素渲染问题，导致白色背景颜色泄漏到子div之外，即使这个子div在理论上应该具有相同的位置和大小。 */
      box-shadow: 0 0 1px 0 #646464 inset, 0 0 1px 0 #646464 inset,
        0 0 1px 0 #646464 inset, 0 0 1px 0 #646464 inset,
        0 0 1px 0 #646464 inset;
      border-radius: 50px;
      overflow: hidden;
      height: 50px;
      width: 50px;
      margin: 0 20px 0 20px;
    }
  }
}

.el-menu {
  border: 0;
}

.el-aside {
  background-color: #303138;
}

.iconfont {
  margin-right: 10px;
  color: #fff;
}

.toggle-button {
  background-color: rgba(64, 64, 75, 0.863);
  font-size: 10px;
  line-height: 20px;
  letter-spacing: 0.2em;
  text-align: center;
  color: rgb(185, 185, 185);
  cursor: pointer;
  transition: all 1s;
}

.toggle-button:hover {
  background-color: #444546;
  text-shadow: #303138;
}

.Head_portrait {
  transition: all 0.8s;
}

.Head_portrait:hover {
  transform: scale(1.3) rotate(360deg);
}
</style>