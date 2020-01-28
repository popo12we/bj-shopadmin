<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区-->
    <el-card class="box-card">
      <!--图标显示的画板-->
      <div id="tubiao" style="width:750px; height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  mounted () {
    // 开始图表绘制
    this.paintDataPic()
  },
  methods: {
    // 绘制图表
    paintDataPic () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('tubiao'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
