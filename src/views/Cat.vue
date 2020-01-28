<template>
  <div>
    <!--面包屑-->
    <bread-crumb one="商品管理" two="分类列表"></bread-crumb>

    <!--添加分类弹框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialog"
      @close="resetForm()"
      width="50%"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="120px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="分类上级：" prop="selectTwoCat">
          <el-cascader
            v-model="addForm.selectTwoCat"
            :options="catListTwo"
            :props="{
                    expandTrigger: 'hover',
                    value:'cat_id',
                    label:'cat_name',
                    checkStrictly:true
                }"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCat()">确 定</el-button>
      </span>
    </el-dialog>

    <!--卡片区-->
    <el-card class="box-card">
      <!--制作搜索框 和 添加 按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog()">添加分类</el-button>
        </el-col>
      </el-row>

      <!--table表格数据制作-->
      <el-table :data="catList" style="width: 100%" border row-key="cat_id">
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="等级" width="280">
          <template slot-scope="stData">
            <el-tag v-if="stData.row.cat_level===0">一级</el-tag>
            <el-tag v-else-if="stData.row.cat_level===1" type="success">二级</el-tag>
            <el-tag v-else type="danger">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期方法
  created () {
    this.getCatList()
  },
  methods: {
    /** 添加分类1 */
    // 给form表单做表面和 本质 的重置处理
    resetForm () {
      this.$refs.addFormRef.resetFields()
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 收集数据存储
    addCat () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          var { data: dt } = await this.$http.post('categories', this.addForm)
          // 关闭 弹框
          this.addDialog = false
          // 成功提示
          this.$message.success(dt.meta.msg)
          // 刷新页面
          this.getCatList()
        }
      })
    },
    // 感知分类被选取后的回调事件
    handleChange () {
      // 通过selectTwoCat计算pid和level
      console.log(this.addForm.selectTwoCat)
      // 判断selectTwoCat的数组长度
      // 0:一级别分类
      // 1:二级别分类
      // 2:三级别分类
      var twocat = this.addForm.selectTwoCat
      if (twocat.length === 0) {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else if (twocat.length === 1) {
        this.addForm.cat_pid = twocat[0]
        this.addForm.cat_level = 1
      } else {
        this.addForm.cat_pid = twocat[1]
        this.addForm.cat_level = 2
      }
    },
    async showAddDialog () {
      // 展示弹框
      this.addDialog = true
      // 获取可供选取的上级分类(1-2两个级别的)
      var { data: dt } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      //   console.log(dt)
      // 把获得好的数据赋予给data成员 catListTwo
      this.catListTwo = dt.data
    },
    /** 添加分类2 */
    // 获取用于展示的分类列表数据
    async getCatList () {
      var { data: dt } = await this.$http.get('categories', {
        params: this.querycdt
      })
      //   console.log(dt)
      // 把获得到的分类列表数据赋予给catList成员
      this.catList = dt.data.result
    }
  },
  data () {
    return {
      /** 添加分类1 */
      addDialog: false, // 对话框默认隐藏
      // form表单对象
      addForm: {
        cat_name: '',
        // 感知选取的级联分类上级，以数组形式呈现
        // [101] :选取第1级别分类
        // [101,150]：选取第2级别分类
        // 该成员放到addForm里边，可以实现重置效果
        selectTwoCat: [],
        cat_pid: 0, // 新分类的上级id
        cat_level: 0 // 新分类的等级
      },
      // 表单校验
      addFormRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      },
      // 可供选取的前两个级别分类
      catListTwo: [],
      /** 添加分类2 */

      /** 列表相关1 */
      // 接收分类数据列表
      catList: [],
      querycdt: {
        type: 3, // 获得全部级别的分类
        pagenum: 1, // 获取第1页数据
        pagesize: 5 // 每页显示5条
      }
      /** 列表相关2 */
    }
  }
}
</script>

<style lang="less" scoped>
</style>
