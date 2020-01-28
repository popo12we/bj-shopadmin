<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--用户分配角色弹框-->
    <el-dialog
      title="用户分配角色"
      :visible.sync="fenpeiDialog"
      @close="$refs.fenpeiFormRef.resetFields()"
      width="50%"
    >
      <el-form ref="fenpeiFormRef" :model="fenpeiForm" :rules="fenpeiFormRules" label-width="120px">
        <el-form-item label="当前的用户：" prop="username">{{fenpeiForm.username}}</el-form-item>
        <el-form-item label="当前的角色：" prop="role_name">{{fenpeiForm.role_name}}</el-form-item>

        <el-form-item label="新分配角色：" prop="rid">
          <el-select v-model="fenpeiForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="fenpeiDialog = false">取 消</el-button>
        <el-button type="primary" @click="fenpeiUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户弹框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialog"
      @close="$refs.editFormRef.resetFields()"
      width="50%"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加用户弹框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialog"
      @close="$refs.addFormRef.resetFields()"
      width="50%"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password ref="mypass"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!--卡片区-->
    <el-card class="box-card">
      <!--制作搜索框 和 添加 按钮-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdt.query"
            clearable
            @clear="getUserList()"
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addDialog=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--table表格数据制作-->
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="100"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>

        <el-table-column label="状态" width="80">
          <!--感知每个用户的完整记录信息-->
          <!-- <div slot-scope="stData">{{stData.row}}</div> -->
          <!--在当前的列中获得每条记录信息，并从中感知每个记录的mg_state状态内容
              具体要通过"作用域插槽"实现
          -->
          <el-switch slot-scope="stData" v-model="stData.row.mg_state" @change="modState(stData.row.id, stData.row.mg_state)"></el-switch>
          <!--el-switch组件的v-model可以"设定或感知"当前开关的状态-->
        </el-table-column>

        <el-table-column label="操作" width="180">
          <!--在当前的column列中要感知每个用户的信息，具体通过"作用域插槽"实现-->
          <template slot-scope="stData">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(stData.row)"
            ></el-button>

            <el-button
              type="danger"
              @click="delUser(stData.row.id)"
              icon="el-icon-delete"
              size="mini"
            ></el-button>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showFenpeiDialog(stData.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页效果-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期方法
  created () {
    this.getUserList()
  },
  methods: {
    /** 修改用户状态1 */
    async modState (uid, state) {
      var { data: dt } = await this.$http.put('users/' + uid + '/state/' + state)
      // 成功提示
      this.$message.success(dt.meta.msg)
      // 页面刷新
      this.getUserList()
    },
    /** 修改用户状态2 */

    /** 分配角色1 */
    // 收集数据存储
    fenpeiUser () {
      this.$refs.fenpeiFormRef.validate(async valid => {
        if (valid) {
          var { data: dt } = await this.$http.put('users/' + this.fenpeiForm.id + '/role', { rid: this.fenpeiForm.rid })
          // 关闭弹框
          this.fenpeiDialog = false
          // 成功提示
          this.$message.success(dt.meta.msg)
          // 页面刷新
          this.getUserList()
        }
      })
    },
    // 展示分配角色的弹框
    async showFenpeiDialog (user) {
      this.fenpeiDialog = true
      // 把传递过来的user赋予给表单对象fenpeiForm
      this.fenpeiForm = user
      // 获取可供分配的角色信息
      var { data: dt } = await this.$http.get('roles')
      // 把获取到的角色赋予给roleList
      this.roleList = dt.data
    },
    /** 分配角色2 */

    /** 修改用户1 */
    // 展示修改用户的对话框
    // 参数user：被修改用户的信息对象(id/username/email/mobile/password...)
    showEditDialog (user) {
      this.editDialog = true
      // 把user赋予给editForm表单对象
      this.editForm = user
    },

    // 收集数据存储
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          var { data: dt } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          // 成功提示
          this.$message.success(dt.meta.msg)
          // 关闭弹框
          this.editDialog = false
          // 数据刷新
          this.getUserList()
        }
      })
    },

    /** 修改用户2 */
    /** 删除用户1 */
    delUser (uid) {
      this.$confirm('确认删除该用户名么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          var { data: dt } = await this.$http.delete('users/' + uid)
          // 删除成功提示
          this.$message.success(dt.meta.msg)

          // 判断当前页码是非首页、并且记录条数还只有1个，那么页码就做递减操作(显示上一页数据)
          if (this.querycdt.pagenum !== 1 && this.userList.length === 1) {
            this.querycdt.pagenum--
          }

          // 页面数据刷新
          this.getUserList()
        })
        .catch(() => {})
    },
    /** 删除用户2 */
    /** 添加用户1 */
    // 添加用户收集信息存储
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 利用axios把收集好信息存储给后端数据库里边
          var { data: dt } = await this.$http.post('users', this.addForm)
          // 关闭弹框
          this.addDialog = false
          // 显示成功信息
          this.$message.success(dt.meta.msg)
          // 页面刷新展示新用户
          this.getUserList()
        }
      })
    },
    /** 添加用户2 */
    /** 分页相关1 */
    // 分页 每页条数 变化的回调处理
    handleSizeChange (newsize) {
      // newsize: 变化后的条数
      // console.log(newsize)
      // 把变化后的条数赋予给 querycdt.pagesize
      this.querycdt.pagesize = newsize
      // 根据变化后的每页条数 获得最新数据
      this.getUserList()
    },

    // 分页 页码 变化的回调处理
    handleCurrentChange (newpage) {
      // newpage: 变化后的页码
      console.log(newpage)
      // 把变化后的页码赋予给 querycdt.pagenum
      this.querycdt.pagenum = newpage
      // 根据新页码获得数据
      this.getUserList()
    },
    /** 分页相关2 */
    // 获得用户列表数据
    async getUserList () {
      var { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      // 对总记录条数进行接收
      this.tot = dt.data.total
      // 把获得好的用户数据赋予给userList成员
      this.userList = dt.data.users
    }
  },
  // 设置监听器，感知data变化
  watch: {
    'addForm.password': function (newval) {
      if (newval.trim().length <= 8) {
        // console.log('green')
        // console.log(this.$refs.mypass) // VueComponent
        // console.log(this.$refs.mypass.getInput()) // input框dom对象
        this.$refs.mypass.getInput().style.color = 'green'
      } else {
        this.$refs.mypass.getInput().style.color = 'red'
      }
    }
  },
  data () {
    // 自定义校验手机号码的规则(利用正则做校验)
    // value: 被校验的数据
    // callback: 回调函数，校验成功或失败都需要执行
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则 1[3456789]后边接9位数字
      var reg = /^1[3-9]\d{9}$/
      if (reg.test(value)) {
        callback() // 校验没有问题，继续执行
      } else {
        return callback(new Error('手机号格式不正确'))
      }
    }
    return {
      /** 分配角色1 */
      fenpeiDialog: false, // 弹框开关
      // form表单对象
      fenpeiForm: {
        username: '',
        role_name: '',
        rid: '' // 接收新分配角色
      },
      // 接收可被分配的角色信息
      roleList: [],
      // 表单校验
      fenpeiFormRules: {
        rid: [
          // 同一个表单域项目可以设置多个规则
          { required: true, message: '角色必须选择', trigger: 'change' }
        ]
      },
      /** 分配角色2 */

      /** 修改用户1 */
      editDialog: false, // 对话框默认隐藏
      // form表单对象
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 表单校验
      editFormRules: {
        mobile: [
          // 同一个表单域项目可以设置多个规则
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      /** 修改用户2 */
      /** 添加用户1 */
      addDialog: false, // 对话框默认隐藏
      // form表单对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单校验
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          // 同一个表单域项目可以设置多个规则
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      /** 添加用户2 */
      // 用户数据
      userList: [],
      // 为了方便获取用户数据传递参数，可以把所有参数通过“对象”给集成好
      tot: 0, // 记录的总条数
      querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 默认获取第1页数据
        pagesize: 3 // 每页显示3条数据
      }
      // tableData: [
      //   {
      //     date: '2016-05-02',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄'
      //   }, {
      //     date: '2016-05-04',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1517 弄'
      //   }, {
      //     date: '2016-05-01',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1519 弄'
      //   }, {
      //     date: '2016-05-03',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1516 弄'
      //   }
      // ]
    }
  }
}
</script>

<style lang="less" scoped>
</style>
