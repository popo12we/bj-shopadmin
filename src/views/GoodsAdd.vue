<template>
  <div class="goodsadd">
    <!-- 面包屑 -->
    <bread-crumb one="商品管理" two="添加商品"></bread-crumb>
    <el-alert
      class="tipsalert"
      title="添加商品详细信息"
      type="info"
      :center="true"
      :closable="false"
      show-icon
    ></el-alert>

    <!-- 进度条 -->
    <el-steps :active="active" :align-center="true" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="动态参数"></el-step>
      <el-step title="静态参数"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!-- 下方面板 -->
    <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">基本信息</el-tab-pane>
      <el-tab-pane label="动态参数" name="second">动态参数</el-tab-pane>
      <el-tab-pane label="静态参数" name="third">静态参数</el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">商品图片</el-tab-pane>
       <el-tab-pane label="商品内容" name="fifth">商品内容</el-tab-pane>
      <el-tab-pane label="完成" name="sixth">完成</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabPosition: 'left',
      // 进度条控制进度
      active: 0,
      // 选项卡控制进度
      activeName: 'first'
    }
  },
  methods: {
    // 选项卡触发逻辑
    handleClick () {
      if (this.activeName === 'first') {
        this.active = 0
      }
      if (this.activeName === 'second') {
        this.active = 1
      }
      if (this.activeName === 'third') {
        this.active = 2
      }
      if (this.activeName === 'fourth') {
        this.active = 3
      }
      if (this.activeName === 'fifth') {
        this.active = 4
      }
      if (this.activeName === 'sixth') {
        this.active = 5
      }
    }
  }

}
</script>

<style lang="less" scoped>
.goodsadd {
  .tipsalert {
    margin: 20px 0;
  }
}
</style>
