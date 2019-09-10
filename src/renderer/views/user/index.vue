<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        style="margin-bottom: -18px;">
        <el-row>
          <el-form-item label="关键字：" label-width="100px">
            <el-input size="small" v-model="listQuery.Name" placeholder="请输入" clearable
                      @keyup.enter.native="handleFilter"/>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" icon="el-icon-search" @click="getList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" icon="el-icon-refresh" @click="handleFilter">刷新</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <el-table
      :data="list"
      style="width: 100%;"
    >
      <el-table-column label="用户姓名" prop="Name" min-width="80"/>
      <el-table-column label="手机" prop="Mobile" min-width="80"/>
      <el-table-column label="账号" prop="Account" min-width="80"/>
      <el-table-column label="单位" prop="CName" min-width="80"/>

      <el-table-column label="操作" align="center" width="320">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleRemove(row)">
            删除
          </el-button>
          <el-button  size="mini" @click="handleRest(row)">
            重置密码
          </el-button>
          <el-button v-if="row.Status == 2" type="primary" size="mini" @click="handleSwicth({...row,Status:1})">
            解除
          </el-button>
          <el-button v-else size="mini" type="danger" @click="handleSwicth({...row,Status:2})">
            冻结
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :background="false" v-show="paging.total>0" :total="paging.total" :page.sync="paging.start" :limit.sync="paging.pagesize" @pagination="getList" />

    <el-dialog :title="title" :visible.sync="dialogVisible" @close="()=>restForm('form','form')">
      <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="70px">
        <el-row>
          <el-col :md="24" :lg="24">
            <el-form-item label="姓名" prop="Name">
              <el-input placeholder="请输入姓名" v-model="form.Name" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="手机" prop="Mobile">
              <el-input placeholder="请输入账号" v-model="form.Mobile" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="账号" prop="Account">
              <el-input placeholder="请输入账号" v-model="form.Account" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24" v-if="!form.Id">
            <el-form-item label="密码" prop="Password">
              <el-input placeholder="请输入密码" type="password" v-model="form.Password" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <!--<el-col :md="24" :lg="24">-->
            <!--<el-form-item label="单位" prop="cid">-->
              <!--<el-select-->
                <!--v-model="form.Cid"-->
                <!--filterable-->
                <!--clearable-->
                <!--:style="{width:'100%'}"-->
                <!--placeholder="请选择"-->
              <!--&gt;-->
                <!--<el-option v-for="item in dict.company" :key="item.Id" :value="item.Id" :label="item.Name" />-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small"  @click="dialogVisible = false">取消</el-button>
        <el-button type="danger" size="small"  @click="sure">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisibleDetail"
      :close-on-click-modal="false"
      @close="restForm">
      <el-form size="mini" label-width="100px">
        <el-row>
          <el-col :md="24" :lg="24">
            <el-form-item label="用户姓名：">
              <span>{{form.Name}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="手机：">
              <span>{{form.Mobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="账号：">
              <span>{{form.Account}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="单位：">
              <span>{{form.Cid}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { get, add, update, remove } from '@/api/userinfo'
  import { resetpassword } from '@/api/user'
  import { get as getCompany} from '@/api/company'
  import { parseTime } from '@/utils'
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
        title: '',
        listQuery: {},
        paging:{
          total:0,
          start:1,
          pagesize:10,
        },
        dict:{
          company:[],
        },
        rules: {
          Name: [{ required: true, message: '请填写用户', trigger: 'blur' }],
          Account: [{ required: true, message: '请填写账号', trigger: 'blur' }],
          Password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
          Mobile: [{ required: true, message: '请填写手机', trigger: 'blur' }],
        }
      }
    },
    created() {
      this.getList();
      this.getCompany();
    },
    methods: {
      sure() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.title == '用户新增'){
              add({ ...this.form,Role:'cuser'}).then(res => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.getList()
              })
            }else{
              update({ ...this.form,Role:'cuser',createtime:undefined }).then(res => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.getList()
              })
            }
          }
        })
      },
      handleAdd() {
        this.form = { ...this.form }
        this.dialogVisible = true
        this.title = '用户新增'
      },
      handleRest(scope){
          resetpassword({id:scope.Id}).then(res => {
              this.$message.success({
                  message:`重置成功，用户：${scope.Name},密码：${res}`,
                  duration:0,
                  showClose:true
              })
          })
      },
      handleSwicth(scope){
        this.$confirm(`确认${scope.Status == 2?'冻结':'解除'}该账号？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (res) => {
            if (res == 'confirm') {
              update({...scope,createtime:undefined}).then(res => {
                this.$message.success('操作成功')
                this.getList()
              });
            }
          }
        })
      },
      handleEdit(scope) {
        this.form = { ...scope}
        this.dialogVisible = true
        this.title = '用户修改'
      },
      handleDetail(scope) {
        this.dialogVisibleDetail = true
        this.title = '用户详情'
        this.form = { ...scope }
      },
      handleRemove(data) {
        this.$confirm('确认删除该条数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (res) => {
            if (res == 'confirm') {
              remove(data.Id).then(()=>{
                this.$message.success('操作成功');
                this.getList()
              })
            }
          }
        })
      },
      getCompany(){
        getCompany().then(res=>{
          this.dict.company = res.Data;
        })
      },
      getList() {
        get({ ...this.listQuery,...this.paging,Role:'cuser' }).then(res => {
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
