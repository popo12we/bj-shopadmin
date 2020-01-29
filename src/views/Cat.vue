<template>
  <div>
    <!--面包屑-->
    <bread-crumb one="商品管理" two="分类列表"></bread-crumb>

    <!--卡片区-->
    <el-card class="box-card">
      <!--制作搜索框 和 添加 按钮-->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        row-key="cat_id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="cat_name" label="分类名称" min-width="180"></el-table-column>
        <el-table-column prop="name" label="等级">
          <template slot-scope="scope">
            <el-tag size="medium" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="medium" type="success" v-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="medium" type="danger" v-if="scope.row.cat_level===2">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表格数据
      tableData: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 拿到表格数据
    async getTableData () {
      let { data } = await this.$http.get('categories', {
        params: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        }
      })
      if (data.meta.status === 200) {
        this.tableData = data.data.result
        console.log(this.tableData)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
