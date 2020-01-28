import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局css样式控制文件
import './assets/css/global.css'

// 引入elementui组件库和注册
// import ElementUI from 'element-ui'

// 引入NProgress进度条相关js和css文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// eslint要求import系列代码都放到上边
// 引入、配置axios
import axios from 'axios'

// 引入公共的面包屑组件
import BreadCrumb from './components/BreadCrumb.vue'

// 给ElementUI做 组件 、事件方法 的按需引入配置
// 按需导入需要的组件
import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Card,
  Steps,
  Step,
  Cascader,
  Container,
  Header,
  Aside,
  Main,
  MessageBox,
  Message
} from 'element-ui'
// 注册组件
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
// 注册方法
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

// 注册面包屑组件
Vue.component('bread-crumb', BreadCrumb)

// 给axios配置拦截器(要在Vue配置$http之前设置)
// 1. 请求拦截器
// console.dir(axios)
axios.interceptors.request.use(
  function (config) {
    // 做业务逻辑处理
    NProgress.start() // 开启进度条
    // config = axios.defaults
    // console.dir(config)
    // 给axios配置携带token
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios

// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  // 生命周期方法
  created () {
    // 2. 响应拦截器
    //    因为要操作Vue对象的$message成员，因此拦截器要放到Vue内部
    this.$http.interceptors.response.use(
      response => {
        // 实现请求完成的后续处理
        NProgress.done() // 关闭进度条

        // response: 就是axios从服务器端返回的信息，可以参考await修饰的返回结果，是一个对象，有成员config/data/headers/status/statusText

        // 判断请求失败
        // 200:获取、修改、删除 操作结果
        // 201:添加 操作结果
        if (response.data.meta.status !== 200 && response.data.meta.status !== 201) {
          return this.$message.error(response.data.meta.msg)
        }

        return response
      },
      function (error) {
        return Promise.reject(error)
      }
    )
  },
  router,
  render: h => h(App)
}).$mount('#app')
