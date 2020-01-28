<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/img/logo.png" alt>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!-- <el-form-item prop="设置校验或重置规则的，内容要求与表单域名字一致"> -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" show-password>
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login()">登录</el-button>
            <el-button type="info" @click="$refs.loginFormRef.resetFields()">重置</el-button>
          </el-col>
        </el-row>

      </el-form>

    </div>
  </div>
</template>

<script>
// 为图标使用引入css文件
import '../assets/fonts/iconfont.css'

export default {
  methods: {
    // 登录系统
    login () {
      // 表单校验，没有问题再登录系统
      // 找到表单：
      // console.log(this) // VueComponent组件对象
      // console.log(this.$refs.loginFormRef) // VueComponent组件对象(el-form)
      this.$refs.loginFormRef.validate(async valid => {
        // valid===true 校验ok
        // valid===false 校验失败
        if (valid) {
          // 把用户名和密码交给axios，之后去服务器端做真实性校验
          // var {data:dt} 对象结构赋值重命名操作
          var { data: dt } = await this.$http.post('login', this.loginForm)

          // 存储token到sessionStorage里边
          window.sessionStorage.setItem('token', dt.data.token)
          // console.log(dt)
          // 页面跳转
          this.$router.push('/home')
        }
      })
    }
  },
  data () {
    return {
      // 表单域校验规则制定
      loginFormRules: {
        // username/password是校验项目，要求与表单域名称一致
        username: [
          // {required:必填规则，message:错误提示,trigger:触发机制}
          { required: true, message: '用户名必填', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' }
        ]
      },
      // 登录表单数据对象model
      loginForm: {
        username: 'admin',
        password: '123456'
      }
    }
  }

}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  overflow: hidden;
  .login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    .avatar-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      box-shadow: 0 0 10px #eee;
      user-select: none;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form{
      position:absolute;
      bottom:0;
      width:100%;
      padding:20px;
      box-sizing: border-box;
    }
  }
}
</style>
