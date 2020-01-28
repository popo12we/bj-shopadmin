<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区-->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!--3个级别分类 级联选取器-->
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectThreeCat"
            :options="catList"
            :props="{
                    expandTrigger: 'hover',
                    value:'cat_id',
                    label:'cat_name'
                }"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!--tabs切换标签-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="disBtn" size="mini">添加动态参数</el-button>

          <el-table :data="manyParamList">
            <el-table-column type="expand">
              <template slot-scope="stData">
                <el-tag v-for="item in stData.row.attr_vals_arr" :key="item">{{item}}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="序号" type="index" width="100"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="240">
              <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" :disabled="disBtn" size="mini">添加静态参数</el-button>

          <el-table :data="onlyParamList">
            <el-table-column type="expand">
              <template slot-scope="stData">
                <el-tag v-for="item in stData.row.attr_vals_arr" :key="item">{{item}}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="序号" type="index" width="100"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="240">
              <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getCatList()
  },
  methods: {
    // 为获取参数列表信息专门定义方法
    // 调用条件：
    // 1. 选中了3级分类后
    // 2. tabs标签切换后(要求之前已经选中3级别分类)
    async getParamList () {
      var { data: dt } = await this.$http.get(
        'categories/' + this.selectCatId + '/attributes',
        {
          params: { sel: this.activeName }
        }
      )
      // console.log(dt)

      // 把参数数据中的attr_vals字段的内容通过空格分隔，变为"数组"
      dt.data.forEach(v => {
           
      })
      // 变完之后，我们的数据中就同时还存在一个attr_vals_arr的数组

      // 判断参数类型并赋予给对应的成员
      if (this.activeName === 'many') {
        this.manyParamList = dt.data
      } else {
        this.onlyParamList = dt.data
      }
    },
    // 切换标签执行的回调
    handleClick () {
      // 如果选中第3级别分类，就要获取参数列表
      if (this.selectCatId !== 0) {
        this.getParamList()
      }
    },
    // 级联选取器 项目选取变化回调处理
    handleChange () {
      // 判断是否选取了第3级别分类
      var len = this.selectThreeCat.length
      if (len === 3) {
        // 激活添加按钮
        this.disBtn = false
        // 把第3级别分类id赋予给selectCatId
        this.selectCatId = this.selectThreeCat[2]
        // 获得参数列表信息
        this.getParamList()
      } else {
        // 禁用添加按钮
        this.disBtn = true
        // 其他情况(例如选取了1或2级别分类时)，统一清空级联选取器
        this.selectThreeCat = []
        // 清除selectCatId
        this.selectCatId = 0
        // 把已经获取好的参数信息清空
        this.manyParamList = []
        this.onlyParamList = []
      }
    },
    // 获取全部级别的分类信息
    async getCatList () {
      var { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      //   console.log(dt)
      // 把获得到的分类列表数据赋予给catList成员
      this.catList = dt.data
    }
  },
  data () {
    return {
      // 参数数据接收成员
      manyParamList: [], // 动态参数
      onlyParamList: [], // 静态参数
      // 按钮禁用true、激活false控制
      disBtn: true,
      // 标签切换默认选中项目设置
      activeName: 'only',
      // 级联选取器 获取选中的项目，是数组形式[101,154,231]
      selectThreeCat: [],
      // 获取第3级别分类id
      selectCatId: 0,
      // 级联选取器 数据来源
      catList: []
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-tag {
  margin: 10px 5px;
}
</style>
