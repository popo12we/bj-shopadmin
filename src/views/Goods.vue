<template>
  <div>
    <!--面包屑-->
    <bread-crumb  one="商品管理" two="商品列表"></bread-crumb>

    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="querycdt.query" clearable @clear="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('goodsadd')">添加商品</el-button>
        </el-col>
      </el-row>

      <!--表格区域-->
      <el-table :data="goodsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90"></el-table-column>
        <el-table-column label="创建时间" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.add_time | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [], // 商品列表数据
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      tot: 0 // 商品总记录条数
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 删除商品
    async delGoods (goodsId) {
      this.$confirm('确认要删除该商品么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('goods/' + goodsId)

          // 刷新
          this.getGoodsList()
          // 提示
          this.$message.success(dt.meta.msg)
        })
        .catch(() => {})
    },

    // 根据关键字检索数据
    search () {
      this.querycdt.pagenum = 1
      this.getGoodsList()
    },

    // 每页显示条数变化回调
    handleSizeChange (val) {
      this.querycdt.pagesize = val
      this.getGoodsList()
    },

    // 页码变化回调处理
    handleCurrentChange (val) {
      this.querycdt.pagenum = val
      this.getGoodsList()
    },

    // 获取商品列表数据
    async getGoodsList () {
      var { data: res } = await this.$http.get('goods', {
        params: this.querycdt
      })

      // console.log(res)
      this.goodsList = res.data.goods
      this.tot = res.data.total
    }
  }
}
</script>
