<template>
  <div class="goodsadd">
    <!-- 面包屑 -->
    <bread-crumb one="商品管理" two="添加商品"></bread-crumb>
    <div class="container">
      <el-alert
        class="tipsalert"
        title="添加商品详细信息"
        type="info"
        :center="true"
        :closable="false"
        show-icon
      ></el-alert>

      <!-- 进度条 -->
      <el-steps class="steps" :active="active" :align-center="true" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="动态参数"></el-step>
        <el-step title="静态参数"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 下方面板 -->
      <el-tabs
        class="tabs"
        :tab-position="tabPosition"
        v-model="activeName"
        :before-leave="leaveTab"
      >
        <el-tab-pane label="基本信息" name="first">
          <!-- 选项卡第一页表单 -->
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="price">
              <el-input v-model="ruleForm.price"></el-input>
            </el-form-item>
            <el-form-item label="重量" prop="weight">
              <el-input v-model="ruleForm.weight"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="num">
              <el-input v-model="ruleForm.num"></el-input>
            </el-form-item>
            <el-form-item label="商品类型" prop="selectThreeCat">
              <el-cascader
                v-model="ruleForm.selectThreeCat"
                :options="CascaderList"
                @change="handleChange"
                :props="{
                    expandTrigger: 'hover',
                    value:'cat_id',
                    label:'cat_name'
                }"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="动态参数" name="second">动态参数</el-tab-pane>
        <el-tab-pane label="静态参数" name="third">静态参数</el-tab-pane>
        <el-tab-pane label="商品图片" name="fourth">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容" name="fifth">商品内容</el-tab-pane>
      </el-tabs>
    </div>
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
      activeName: 'first',
      // 选项卡第一项表单
      ruleForm: {
        name: '',
        price: '',
        weight: '',
        num: '',
        selectThreeCat: ''
      },
      // 表单校验规则
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
        num: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        selectThreeCat: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      value: [],
      CascaderList: []
    }
  },
  created () {
    this.getCascaderList()
  },
  methods: {
    // 选项卡触发逻辑
    leaveTab (activeName) {
      if (activeName !== 'first') {
        this.validateForm()
        if (!this.validresult) {
          return false
        }
      }
    },
    // 第一项表单校验
    validateForm (activeName) {
      this.$refs['ruleForm'].validate(valid => {
        this.validresult = valid
        if (valid) {
          alert('submit!')
        } else {
          this.$message.error('请先填写基本信息')
          return valid
        }
      })
      return this.validresult
    },
    // 拿到级联数据
    async getCascaderList () {
      var { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      //   console.log(dt)
      // 把获得到的分类列表数据赋予给catList成员
      this.CascaderList = dt.data

      this.CascaderList.forEach(item => {
        item.value = item.cat_pid
        item.label = item.cat_name
        if (item.children) {
          item.children.forEach(item1 => {
            item1.value = item1.cat_pid
            item1.label = item1.cat_name
            if (item1.children) {
              item1.children.forEach(item2 => {
                item2.value = item2.cat_pid
                item2.label = item2.cat_name
              })
            }
          })
        }
      })
      console.log(this.CascaderList)
    }
  }
}
</script>

<style lang="less" scoped>
.goodsadd {
  .container {
    padding: 20px;
    margin-top: 15px;
    background-color: #fff;
    .steps {
      margin: 20px;
    }
    .tabs {
    }
  }
}
</style>
