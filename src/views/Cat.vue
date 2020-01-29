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
    </el-card>
  </div>
</template>

<script>
export default {
  created () {},
  methods: {
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
</style>
