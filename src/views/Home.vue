<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width=" zhe?'65px':'200px' ">
        <div class="toggle_bar" @click="zhe=!zhe">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="zhe"
          :collapse-transition="false"
          router
        >
          <el-submenu
            v-for="item in menuList"
            :key="item.id"
            :index="item.id+''"
            :style="{width:zhe?'65px':'200px'}"
          >
            <template slot="title">
              <i :class="'iconfont icon-'+iconList[item.path]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              v-for="item2 in item.children"
              :key="item2.id"
              :index="item2.path"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!--第3级别业务组件显示占位符-->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 生命周期
  created () {
    this.getMenuList()
  },
  methods: {
    // 退出系统
    logout () {
      this.$confirm('确认退出系统么?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除token、跳转到登录页面
        window.sessionStorage.clear()
        this.$router.push('/login')
      }).catch(() => {})
    },

    // 获得真实菜单数据
    async getMenuList () {
      // 利用axios请求具体的url地址，获得对应的数据
      var { data: dt } = await this.$http.get('menus')

      // 把获得好的菜单数据赋予给menuList成员
      this.menuList = dt.data
    }
  },
  data () {
    return {
      // 菜单是否折叠, false:展开   true:折叠
      zhe: false,
      // 菜单数据成员
      menuList: [],
      // 给一级菜单定义差异化的图标标志
      iconList: {
        // 左侧菜单数据path字段内容: 图标标志信息
        users: 'users',
        rights: 'tijikongjian',
        goods: 'shangpin',
        orders: 'danju',
        reports: 'baobiao'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    padding: 0;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo-box {
      color: #fff;
      font-size: 22px;
      display: flex;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle_bar {
      height: 25px;
      background-color: #4a5064;
      text-align: center;
      letter-spacing: 0.1em;
      color: #fff;
      font-size: 12px;
      line-height: 25px;
      user-select: none;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
