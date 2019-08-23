<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        style="margin-bottom: -18px;">
        <el-row>
          <el-form-item label="关键字：" label-width="100px">
            <el-input v-model="listQuery.Name" size="small" placeholder="请输入" clearable
                      @keyup.enter.native="handleFilter"/>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" icon="el-icon-search" @click="getList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" icon="el-icon-refresh" @click="handleFilter">刷新</el-button>
          </el-form-item>
          <el-form-item>
          </el-form-item>
        </el-row>
      </el-form>

    </div>

    <el-table
      :data="list"
      style="width: 100%;"
    >
      <el-table-column label="公司名称" prop="Cname" min-width="60"/>
      <el-table-column label="用户名称" prop="Uname" min-width="60"/>
      <el-table-column label="用户MAC" prop="Macaddress" min-width="80"/>
      <el-table-column label="操作" prop="Operation" min-width="60"/>
      <el-table-column label="类别" prop="Type" min-width="60"/>
      <el-table-column label="内容" prop="Content" min-width="120"/>
      <el-table-column label="操作时间" align="Createtime" min-width="80">
        <template slot-scope="{row}">
          {{row.Createtime&&row.Createtime.time | parseTime}}
        </template>
      </el-table-column>

      <!--<el-table-column label="操作" align="center" width="80">-->
        <!--<template slot-scope="{row}">-->
          <!--&lt;!&ndash;<el-button type="primary" size="mini" @click="handleEdit(row)">&ndash;&gt;-->
            <!--&lt;!&ndash;编辑&ndash;&gt;-->
          <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
          <!--<el-button size="mini" type="danger" @click="handleRemove(row)">-->
            <!--删除-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <pagination :background="false" v-show="paging.total>0" :total="paging.total" :page.sync="paging.start" :limit.sync="paging.pagesize" @pagination="getList" />
  </div>
</template>

<script>
  import {get, add, update, remove} from '@/api/log'
  import {get as getTemplate} from '@/api/doctemplate'
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'index',
    components: { Pagination },
    data() {
      return {
        list: [],
        dialogVisible: false,
        dialogVisibleDetail: false,
        form: {},
        dict: {
          template: [],
        },
        fileList:[],
        title: '',
        listQuery: {},
        paging: {
          total: 0,
          start: 1,
          pagesize: 10,
        },
        rules: {
          Name: [{required: true, message: '请填写文件名', trigger: 'blur'}],
          Cateid: [{required: true, message: '请填写分裂', trigger: 'blur'}],
          Version: [{required: true, message: '请填写版本', trigger: 'blur'}],
          Ext: [{required: true, message: '请填写文件格式', trigger: 'blur'}],
          Path: [{required: true, message: '请填写路径', trigger: 'blur'}],
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      success(data){
        if (data.returnCode!=-1) {
          this.$message.success(data.msg)
        } else {
          this.$message.error(data.msg)
        }
        this.fileList = [];
      },
      sure() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.title == '模板新增') {
              add({...this.form}).then(res => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.getList()
              })
            } else {
              update({...this.form}).then(res => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.getList()
              })
            }
          }
        })
      },
      handleAdd() {
        this.form = {...this.form}
        this.dialogVisible = true
        this.title = '模板新增'
      },
      handleEdit(scope) {
        this.form = {...scope}
        this.dialogVisible = true
        this.title = '模板修改'
      },
      handleDetail(scope) {
        this.dialogVisibleDetail = true
        this.title = '模板详情'
        this.form = {...scope.row}
      },
      handleRemove(data) {
        this.$confirm('确认删除该条数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (res) => {
            if (res == 'confirm') {
              remove(data.Id).then(() => {
                this.$message.success('操作成功');
                this.getList()
              })
            }
          }
        })
      },
      getTemplate() {
        getTemplate().then(res => {
          this.dict.template = res.Data;
        })
      },
      getList() {
        get({...this.listQuery, ...this.paging, Role: 'manager'}).then(res => {
          this.list = res.Data;
          this.paging.total = res.Recordsfiltered;
        })
      },
      handleFilter() {
        this.listQuery = {}
        this.getList()
      }
    }
  }
</script>
