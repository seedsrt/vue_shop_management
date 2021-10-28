<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rigthsList" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="60"> </el-table-column>
        <el-table-column prop="authName" label="管理名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="180">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'" type="danger">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="warning"
              >二级</el-tag
            >
            <el-tag v-else-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "MyRights",
  data() {
    return {
      //权限列表
      rigthsList: [],
    };
  },

  created() {
    //获取权限列表数据
    this.getRightsList();
  },

  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.rigthsList = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
</style>