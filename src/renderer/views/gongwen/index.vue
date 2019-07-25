<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        style="margin-bottom: -18px;">
        <el-row>
          <el-form-item label="文件名：" label-width="100px">
            <el-input v-model="listQuery.Name" placeholder="请输入" clearable
                      @keyup.enter.native="handleFilter"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" @click="handleFilter">刷新</el-button>
          </el-form-item>
          <!--<el-form-item>-->
            <!--<el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>-->
          <!--</el-form-item>-->
        </el-row>
      </el-form>

    </div>

    <el-table
      :data="list"
      style="width: 100%;"
    >
      <el-table-column label="文件名" prop="Name" min-width="80"/>
      <el-table-column label="分类Id" prop="Cateid" min-width="80"/>
      <el-table-column label="下载次数" prop="Download" min-width="80"/>
      <el-table-column label="版本" prop="Version" min-width="80"/>
      <el-table-column label="文件格式" prop="Ext" min-width="80"/>
      <el-table-column label="文件路径" prop="Path" min-width="80"/>
      <el-table-column label="操作时间" align="Createtime" min-width="80">
        <template slot-scope="{row}">
          {{row.Createtime&&row.Createtime.time | parseTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="{row}">
          <!--<el-button type="primary" size="mini" @click="handleEdit(row)">-->
            <!--编辑-->
          <!--</el-button>-->
          <el-button size="mini" type="danger" @click="handleRemove(row)">
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
            <el-form-item label="文件名" prop="Name">
              <el-input placeholder="请输入文件名" v-model="form.Name" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="模板" prop="Cateid">
              <el-select
                v-model="form.Cateid"
                filterable
                clearable
                :style="{width:'100%'}"
                placeholder="请选择"
              >
                <el-option v-for="item in dict.template" :key="item.Id" :value="item.Id" :label="item.Name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="版本" prop="Version">
              <el-input placeholder="请输入版本" v-model="form.Version" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="文件格式" prop="Ext">
              <el-input placeholder="请输入文件格式" v-model="form.Ext" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="文件路径" prop="Path">
              <el-input placeholder="请输入文件路径" v-model="form.Path" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="文件上传" >
              <el-upload
                class="upload-demo"
                :on-success="success"
                action="1"
                :fileList="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
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
      <el-form size="mini" label-width="70px">
        <el-row>
          <el-col :md="12" :lg="12">
            <el-form-item label="模板：">
              <span>{{form.Name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {get, add, update, remove} from '@/api/doc'
  import {get as getTemplate} from '@/api/doctemplate'
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
      this.getTemplate();
    },
    methods: {
      success(data){
        if (data.returnCode!=-1) {
          this.$message({message: data.returnMsg, type: 'success'})
        } else {
          this.$message.error(data.returnMsg)
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
