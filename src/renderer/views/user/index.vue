<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
              :inline="true"
              :model="listQuery"
              style="margin-bottom: -18px;">
        <el-row>
          <el-form-item label="账号：" label-width="100px">
            <el-input size="small" v-model="listQuery.Name" placeholder="请输入" clearable
                      @keyup.enter.native="getList"/>
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
      <el-table-column label="序号" type="index" align="center" show-overflow-tooltip width="50px"/>
      <el-table-column label="账号" prop="Account" min-width="80"/>
      <el-table-column label="客户名称" prop="Cname" min-width="80"/>
      <el-table-column label="姓名" prop="Name" min-width="80"/>
      <el-table-column label="手机" prop="Mobile" min-width="80"/>
      <el-table-column label="创建时间" prop="Createtime" min-width="80">
        <template slot-scope="{row}">
          <span>{{row.Createtime | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleRemove({...row,Status:4})">
            删除
          </el-button>
          <el-button size="mini" @click="handleRest(row)">
            重置密码
          </el-button>
          <el-button v-if="row.status == 2" type="primary" size="mini" @click="handleSwicth({...row,Status:2})">
            解除
          </el-button>
          <el-button v-else size="mini" type="danger" @click="handleSwicth({...row,Status:3})">
            冻结
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :background="false" v-show="paging.total>0" :total="paging.total" :page.sync="paging.page"
                :limit.sync="paging.limit" @pagination="getList"/>

    <el-dialog :title="title" :visible.sync="dialogVisible" @close="()=>restForm('form','form')">
      <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="90px">
        <el-row>
          <el-col :md="24" :lg="24">
            <el-form-item label="姓名" prop="name">
              <el-input placeholder="请输入姓名" v-model="form.Name" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="手机" prop="mobile">
              <el-input placeholder="请输入账号" v-model="form.Mobile" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="账号" prop="account">
              <el-input placeholder="请输入账号" v-model="form.Account" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24" v-if="!form.Id">
            <el-form-item label="密码" prop="Password">
              <el-input placeholder="请输入密码" ref="password" :type="passwordType" v-model="form.Password" >
                <span slot="suffix" @click.stop="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible = false">取消</el-button>
        <el-button type="danger" size="small" @click="sure">确定</el-button>
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
              <span>{{form.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="手机：">
              <span>{{form.mobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="账号：">
              <span>{{form.account}}</span>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24">
            <el-form-item label="客户名称：">
              <span>{{form.cid}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import {userbyStatus, get, add, update, remove} from '@/api/userinfo'
    import {resetpassword} from '@/api/user'
    import {get as getCompany} from '@/api/company'
    import {parseTime} from '@/utils'
    import Pagination from '@/components/Pagination'

    export default {
        name: 'index',
        components: {Pagination},
        data() {
            return {
                list: [],
                dialogVisible: false,
                dialogVisibleDetail: false,
                form: {password:''},
                passwordType:'password',
                title: '',
                listQuery: {},
                paging: {
                    total: 0,
                    limit: 10,
                    page: 1,
                    sort:'Createtime',
                    order:'desc',//asc升序 desc倒序
                },
                dict: {
                    company: [],
                    role: [{Id: 'puser', Name: '平台普通用户'}, {Id: 'cadmin', Name: '平台普通用户'}]
                },
                rules: {
                    Cid: [{required: true, message: '请填写客户名称', trigger: 'blur'}],
                    Account: [{required: true, message: '请填写账号', trigger: 'blur'}],
                    Password: [{required: true, message: '请填写密码', trigger: 'blur'}],
                    Name: [{required: true, message: '请填写姓名', trigger: 'blur'}],
                    Mobile: [{required: true, message: '请填写手机', trigger: 'blur'},
                        {min: 11, max: 11, message: '请填写正确手机号', trigger: 'blur'
                        }],
                }
            }
        },
        created() {
            this.getList();
            this.getCompany();
        },
        methods: {
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = 'text'
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },
            sure() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if (this.title == '账号新增') {
                            add({...this.form, Role: 'cadmin'}).then(res => {
                                this.$message.success('操作成功')
                                this.dialogVisible = false
                                this.getList()
                            })
                        } else {
                            update({...this.form, createtime: undefined}).then(res => {
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
                this.title = '账号新增'
            },
            handleRest(scope) {
                resetpassword({id: scope.Id||scope.id}).then(res => {
                    this.$message.success({
                        message: `重置成功，用户：${scope.Name||scope.name},密码：${res}`,
                        duration: 0,
                        showClose: true
                    })
                })
            },
            handleEdit(scope) {
                this.form = {...scope}
                this.dialogVisible = true
                this.title = '账号修改'
            },
            handleSwicth(scope) {
                this.$confirm(`确认${scope.Status == 3 ? '冻结' : '解除'}该账号？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: (res) => {
                        if (res == 'confirm') {
                            update({...scope, createtime: undefined}).then(res => {
                                this.$message.success('操作成功')
                                this.getList()
                            });
                        }
                    }
                })
            },
            handleDetail(scope) {
                this.dialogVisibleDetail = true
                this.title = '用户详情'
                this.form = {...scope}
            },
            handleRemove(scope) {
                this.$confirm('确认删除该条数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: (res) => {
                        if (res == 'confirm') {
                            update({...scope, createtime: undefined}).then(res => {
                                this.$message.success('操作成功')
                                this.getList()
                            });
                        }
                    }
                })
            },
            getCompany() {
                getCompany().then(res => {
                    this.dict.company = res.Data;
                })
            },
            getList() {
                // get({ ...this.listQuery,...this.paging}).then(res => {
                userbyStatus({...this.listQuery, ...this.paging, Status: '1,2,3', role: 'cuser',cid:JSON.parse(localStorage.getItem('user')).cid}).then(res => {
                    this.list = res.info.list || [];
                    this.paging.total = res.info.total;
                })
            },
            handleFilter() {
                this.listQuery = {}
                this.getList()
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>
