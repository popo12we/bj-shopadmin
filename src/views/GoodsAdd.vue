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
      <el-tabs :tab-position="tabPosition" :before-leave="leaveTab" v-model="activeName" @tab-click="handleClick">
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
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="ruleForm.price"></el-input>
            </el-form-item>
            <el-form-item label="重量" prop="weight">
              <el-input v-model.number="ruleForm.weight"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="num">
              <el-input v-model.number="ruleForm.num"></el-input>
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
        <el-tab-pane label="商品图片" name="fourth">
          <!-- 图片上传 -->
          <el-upload
          :headers="uploadHeaders"
          action="http://127.0.0.1:11333/api/private/v1/upload"
           list-type="picture"
           :on-success="handleAvatarSuccess"
           >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="fifth">
          <!-- 富文本 -->
          <quill-editor
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
          ></quill-editor>
          <el-button type="primary" @click="submit">添加</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css' // 调用富文本编辑器
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      token: sessionStorage.getItem('token'),
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
        price: [
          { required: true, message: '请输入价格' },
          { type: 'number', message: '必须是数字', trigger: ['blur', 'change'] }
        ],
        weight: [
          { required: true, message: '请输入重量' },
          { type: 'number', message: '必须是数字' }
        ],
        num: [
          { required: true, message: '请输入数量' },
          { type: 'number', message: '必须是数字' }
        ],
        selectThreeCat: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      value: [],
      CascaderList: [],
      //  富文本编辑器配置
      editorOption: {
        theme: 'snow',
        placeholder: '请输入正文'
      },
      content: '',
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      imgList: []
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
    // 选项卡切换事件
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
    },
    // 级联选中
    handleChange (value) {
      this.ruleForm.selectThreeCat = value.join(',')
      console.log(this.ruleForm.selectThreeCat)
    },
    // 第一项表单校验
    validateForm (activeName) {
      this.$refs['ruleForm'].validate(valid => {
        this.validresult = valid
        if (!valid) {
          this.$message.error('请按要求填写基本信息')
          return valid
        }
      })
      return this.validresult
    },
    // 拿到级联数据
    async getCascaderList () {
      let { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
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
    },
    // 图片上传完触发的事件
    handleAvatarSuccess (res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      console.log(res)
      console.log(file)
      this.imgList.push(res.data.tmp_path)
    },
    // 点击按钮发送请求
    async submit () {
      let res = await this.$http.post('goods', {
        goods_name: this.ruleForm.name,
        goods_cat: this.ruleForm.selectThreeCat,
        goods_price: this.ruleForm.price,
        goods_number: this.ruleForm.num,
        goods_weight: this.ruleForm.weight,
        goods_introduce: this.content,
        pics: this.imgList
      })
      if (res.data.meta.msg === '创建商品成功') {
        this.$router.push('/goods')
      }
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
  }
}
</style>
