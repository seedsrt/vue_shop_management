<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <!-- 查找输入框 -->
          <el-input
            placeholder="请输入内容"
            style="width: 40%"
            v-model="queryInfor.query"
             @change="getGoodsList"
            @clear="getGoodsList"
            clearable
          >
            <template slot="append">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getGoodsList"
              ></el-button>
            </template>
          </el-input>
          <!-- 添加按钮框 -->
          <el-button type="primary" style="margin-left: 20px"
          @click="goAddpage"
            >添加商品
          </el-button>
        </el-col>
        <el-col>
          <!-- 商品表格区域 -->
          <el-table :data="goodsList" style="width: 100%" border stripe>
            <el-table-column type="index" label="#" width="50">
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称">
            </el-table-column>
            <el-table-column
              prop="goods_price"
              label="商品价格(元)"
              width="105"
            >
            </el-table-column>
            <el-table-column
              prop="goods_weight"
              label="商品重量"
              width="90"
            ></el-table-column>
            <el-table-column
              prop="add_time"
              label="创建时间"
              width="160"
              :formatter="formatrDate"
            ></el-table-column>
            <el-table-column label="操作" width="130">
              <template slot-scope="scope">
                <!-- 作用域插槽按钮区 -->
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeById(scope.row.goods_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfor.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfor.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "MyGoodsList",
  data() {
    return {
      /* 接收商品列表信息 */
      goodsList: [],

      /* 总数 */
      total: 0,
      /* 查询参数对象 */
      queryInfor: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    /* 获取商品列表信息 */
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfor,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表信息失败");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },

    /* 时间格式化 */
    formatrDate(value) {
      let dataValue = this.dayjs(value.add_time * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return dataValue;
    },

    /* 监听pagesize改变的事件 */
    handleSizeChange(newsize) {
      this.queryInfor.pagesize = newsize;
      this.getGoodsList();
    },

    /* 监听页码值改变 */
    handleCurrentChange(newpage) {
      this.queryInfor.pagenum = newpage;
      this.getGoodsList();
    },

    /* 点击删除按钮 */
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);

      if (confirmResult !== "confirm") {
        return this.$notify.info({
          title: "取消删除",
          message: "已取消删除",
        });
      }
      const { data: res } = await this.$http.delete("goods/" + id);
      if (res.meta.status !== 200) {
        return this.$notify.error({
          title: "失败",
          message: "删除商品失败",
        });
      }
      this.$notify({
        title: "成功",
        message: "删除商品成功",
        type: "success",
      });
      this.getGoodsList();
    },

    /* 点击添加商品转换路由 */
    goAddpage() {
      this.$router.push('/goods/add')
    }
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
</style>