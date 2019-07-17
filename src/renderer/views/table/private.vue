<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        style="margin-bottom: -18px;">
        <el-row>
          <el-form-item label="词：" label-width="60px">
            <el-input v-model="listQuery.Name" placeholder="请输入" clearable
                      @keyup.enter.native="handleFilter"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" @click="handleFilter">刷新</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          </el-form-item>
        </el-row>
      </el-form>

    </div>

    <el-table
      :data="list"
      style="width: 100%;"
    >
      <el-table-column label="词" prop="Name" min-width="80"/>
      <el-table-column label="类型" prop="Cateid" min-width="80"/>
      <el-table-column label="用户ID" prop="Uid" min-width="80"/>
      <el-table-column label="单位ID" prop="Cid" min-width="80"/>

      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleDetail(row)">-->
          <!--详情-->
          <!--</el-button>-->
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleRemove(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paging.total>0" :total="paging.total" :page.sync="paging.start" :limit.sync="paging.pagesize" @pagination="getList" />

    <el-dialog :title="title" :visible.sync="dialogVisible" @close="()=>restForm('form','form')">
      <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="100px">
        <el-row>
          <el-col :md="24" :lg="24">
            <el-form-item label="词" prop="Name">
              <el-input placeholder="请输入词" v-model="form.Name" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="词库分类" prop="Cateid">
              <el-cascader
                :style="{width:'100%'}"
                v-model="form.Cateid"
                :options="dict.category"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="sure">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisibleDetail"
      :close-on-click-modal="false"
      @close="restForm">
      <el-form size="mini" label-width="100px">
        <el-row>
          <el-col :md="12" :lg="12">
            <el-form-item label="词：">
              <span>{{form.Name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {get, add, update, remove} from '@/api/word'
  import {get as getCategory} from '@/api/category'
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
        form: {Cateid:[]},
        title: '',
        listQuery: {},
          paging: {
              total: 0,
              start: 1,
              pagesize: 10,
          },
        dict: {
          category: [],
          catecategoryListgory:[],
        },
        rules: {
          Name: [{required: true, message: '请填写词', trigger: 'blur'}],
          Cateid: [{required: true, message: '请填写词库分类', trigger: 'blur'}],
        }
      }
    },
    created() {
      this.getList();
      this.getgetCategory()
    },
    methods: {
      restForm(formfer, form) {
        this.$refs[formfer] && this.$refs[formfer].resetFields();
        this.$refs[formfer] && this.$refs[formfer].clearValidate();
        this[form] = {Cateid: []};
      },
      sure() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.title == '词新增') {
              add({...this.form, Scope: 0,Cateid:this.form.Cateid[this.form.Cateid.length-1]}).then(res => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.getList()
              })
            } else {
              update({...this.form, Scope: 0,Cateid:this.form.Cateid[this.form.Cateid.length-1]}).then(res => {
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
        this.title = '词新增'
      },
      handleEdit(scope) {
        this.form = {...scope,Cateid:this._getIds(this.dict.catecategoryListgory,scope.Cateid)}
        this.dialogVisible = true
        this.title = '词修改'
      },
      handleDetail(scope) {
        this.dialogVisibleDetail = true
        this.title = '词详情'
        this.form = {...scope}
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
      getgetCategory() {
        getCategory({Scope: 0}).then(res => {
          this.dict.category = this.listToTreeData(res.Data, ['Id', 'value', 'Name', 'label']);
          this.dict.catecategoryListgory = res.Data;
        })
      },
      getList() {
        get({...this.listQuery, Scope: 0}).then(res => {
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
