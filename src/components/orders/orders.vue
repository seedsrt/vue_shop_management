<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <!-- 查找输入框 -->
          <el-input
            placeholder="请输入内容"
            style="width: 30%"
            v-model="queryInfor.query"
            @change="getOrdersList"
            @clear="getOrdersList"
            clearable
          >
            <template slot="append">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </el-col>

        <el-col>
          <el-table :data="OrdersList" style="width: 100%" border>
            <el-table-column type="index" label="#" width="50">
            </el-table-column>
            <el-table-column prop="order_number" label="订单编号">
            </el-table-column>
            <el-table-column prop="order_price" label="订单价格" width="80">
            </el-table-column>
            <el-table-column prop="pay_status" label="是否付款" width="80">
              <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.pay_status === '0'"
                  >未付款</el-tag
                >
                <el-tag type="success" v-else>已付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" width="80">
              <template slot-scope="scope">
                {{ scope.row.is_send }}
              </template>
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="下单时间"
              width="400"
              :formatter="formatrDate"
            >
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  title="修改订单地址"
                  @click="showAddresDialog"
                ></el-button>
                <el-button
                  type="success"
                  icon="el-icon-location"
                  size="mini"
                  title="物流进度"
                  @click="showProgressDialog(scope.row)"
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

    <!-- 修改地址的对话框 -->
    <el-dialog
      @close="addressDialogClosed"
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="Province">
          <el-cascader
            filterable
            clearable
            check-strictly
            v-model="addressForm.Province"
            :options="city"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="address"
          v-model="addressForm.address"
        >
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(item, index) in progressInfo"
          :key="index"
          :timestamp="item.time"
        >
         <el-card>
       {{ item.context }}
      </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import city from "./city.js";
export default {
  name: "MyOrders",
  data() {
    return {
      /* 获取订单数据 */
      OrdersList: [],
      /* 总数 */
      total: 0,
      /* 查询参数对象 */
      queryInfor: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      /* 修改地址的对话框隐藏与显示 */
      addressDialogVisible: false,

      /* 物流进度的对话框隐藏与显示 */
      progressDialogVisible: false,

      /* 修改地址的表单数据 */
      addressForm: {
        Province: [],
        address: "",
      },

      /* 修改地址的规则 */
      addressFormRules: {
        Province: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },

      /* 城市的数据 */
      city,

      /* 物流订单进度数据 */
      progressInfo: [
        {
          time: "2021.10.07 14:21",
          ftime: "2021.10.07 14:21",
          context:
            "客户签收人: 已签收，签收人凭取货码签收。 已签收 感谢使用圆通速递，期待再次为您服务 如有疑问请联系：132，投诉电话：185。疫情期间圆通每天对网点多次消毒，快递小哥每天测量体温，佩戴口罩",
          location: "",
        },
        {
          time: "2021.10.07 09:25",
          ftime: "2021.10.07 09:25",
          context:
            "快件已由学院新综合楼架空层菜鸟驿站代收，请及时取件，如有疑问请联系132",
          location: "",
        },
        {
          time: "2021.10.07 07:07",
          ftime: "2021.10.07 07:07",
          context: "【广东省广州市从化区街口公司】 已收入",
          location: "",
        },
        {
          time: "2021.10.07 06:24",
          ftime: "2021.10.07 06:24",
          context:
            "【广东省广州市从化街口温泉镇分部公司】 派件中 派件人: 邝 电话 132 。 圆通快递小哥每天已测体温，请放心收寄快递 如有疑问，请联系：185",
          location: "",
        },
        {
          time: "2021.10.07 04:59",
          ftime: "2021.10.07 04:59",
          context:
            "【广州转运中心】 已发出 下一站 【广东省广州市从化区街口公司】",
          location: "",
        },
        {
          time: "2021.10.07 04:49",
          ftime: "2021.10.07 04:49",
          context: "【广州转运中心公司】 已打包",
          location: "",
        },
        {
          time: "2021.10.07 04:25",
          ftime: "2021.10.07 04:25",
          context: "【广州转运中心公司】 已收入",
          location: "",
        },
        {
          time: "2021.10.06 22:08",
          ftime: "2021.10.06 22:08",
          context: "【揭阳转运中心】 已发出 下一站 【广州转运中心公司】",
          location: "",
        },
        {
          time: "2021.10.06 21:51",
          ftime: "2021.10.06 21:51",
          context: "【揭阳转运中心公司】 已收入",
          location: "",
        },
        {
          time: "2021.10.06 19:43",
          ftime: "2021.10.06 19:43",
          context: "【广东省潮州市饶平县】 已发出 下一站 【揭阳转运中心公司】",
          location: "",
        },
        {
          time: "2021.10.06 15:15",
          ftime: "2021.10.06 15:15",
          context: "【广东省潮州市饶平县公司】 已打包",
          location: "",
        },
        {
          time: "2021.10.06 15:10",
          ftime: "2021.10.06 15:10",
          context: "【广东省潮州市饶平县公司】 已揽收 取件人: 吴 (132)",
          location: "",
        },
      ],
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfor,
      });
      if (res.meta.status !== 200) {
        return this.$massage.error("获取订单数据失败");
      }
      this.OrdersList = res.data.goods;
      this.total = res.data.total;
    },

    /* 时间格式化 */
    formatrDate(value) {
      let dataValue = this.$moment(value.create_time * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return dataValue;
    },
    /* 监听pagesize改变的事件 */
    handleSizeChange(newsize) {
      this.queryInfor.pagesize = newsize;
      this.getOrdersList();
    },

    /* 监听页码值改变 */
    handleCurrentChange(newpage) {
      this.queryInfor.pagenum = newpage;
      this.getOrdersList();
    },

    /* 展示修改地址的对话框 */
    showAddresDialog() {
      this.addressDialogVisible = true;
    },

    /* 修改地址对话框关闭时执行 */
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },

    /* 物流进度对话框的关闭时执行 */
    async showProgressDialog() {
      this.progressDialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>