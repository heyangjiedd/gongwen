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
                        <el-button type="danger" size="small" icon="el-icon-refresh" @click="handleFilter">刷新
                        </el-button>
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
            <el-table-column label="单位" prop="Cname" min-width="80"/>
            <el-table-column label="客户" prop="Uname" min-width="80"/>
            <el-table-column label="MAC地址" prop="Macaddress" min-width="80"/>
            <el-table-column label="有效期开始" align="Starttime" min-width="80">
                <template slot-scope="{row}">
                    {{row.Starttime&&row.Starttime.time | parseTime}}
                </template>
            </el-table-column>
            <el-table-column label="有效期结束" align="Endtime" min-width="80">
                <template slot-scope="{row}">
                    {{row.Endtime&&row.Endtime.time | parseTime}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="{row}">
                    <el-button type="text" size="mini" @click="handleEdit(row)">
                        编辑
                    </el-button>
                    <el-button size="mini" type="text" @click="handleRemove(row)">
                        删除
                    </el-button>
                    <el-button type="text" size="mini" @click="handleDetail(row)">
                        生成
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :background="false" v-show="paging.total>0" :total="paging.total" :page.sync="paging.start"
                    :limit.sync="paging.pagesize" @pagination="getList"/>

        <el-dialog :title="title" :visible.sync="dialogVisible" @close="()=>restForm('form','form')">
            <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="100px">
                <el-row>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="单位" prop="Cid">
                            <el-select
                                    v-model="form.Cid"
                                    filterable
                                    clearable
                                    :style="{width:'100%'}"
                                    placeholder="请选择">
                                <el-option v-for="item in dict.company" :key="item.Id" :value="item.Id"
                                           :label="item.Name"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="用户" prop="Uid">
                            <el-select
                                    v-model="form.Uid"
                                    filterable
                                    clearable
                                    :style="{width:'100%'}"
                                    placeholder="请选择">
                                <el-option v-for="item in dict.user" :key="item.Id" :value="item.Id"
                                           :label="item.Name"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="MAC地址" prop="Macaddress">
                            <el-input placeholder="请输入MAC地址" v-model="form.Macaddress" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="有效期开始" prop="Starttime">
                            <el-date-picker
                                    v-model="form.Starttime"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="请输入有效期开始">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="有效期结束" prop="Endtime">
                            <el-date-picker
                                    v-model="form.Endtime"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="请输入有效期开始">
                            </el-date-picker>
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
                        <el-form-item label="单位：">
                            <span>{{form.Cid}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="用户：">
                            <span>{{form.Uid}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="MAC地址：">
                            <span>{{form.Macaddress}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="有效期开始：">
                            <span>{{form.Starttime}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="有效期结束：">
                            <span>{{form.Endtime}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {get, add, update, remove, CreateLicense} from '@/api/license'
    import {get as getCompany} from '@/api/company'
    import {get as getUser} from '@/api/userinfo'
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
                form: {},
                title: '',
                listQuery: {},
                paging: {
                    total: 0,
                    start: 1,
                    pagesize: 10,
                },
                dict: {
                    company: [],
                    user: [],
                },
                rules: {
                    Cid: [{required: true, message: '请填写单位', trigger: 'blur'}],
                    Uid: [{required: true, message: '请填写用户', trigger: 'blur'}],
                    Macaddress: [{required: true, message: '请填写MAC地址', trigger: 'blur'}],
                }
            }
        },
        created() {
            this.getList();
            this.getCompany();
            this.getUser();
        },
        methods: {
            sure() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if (this.title == '用户新增') {
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
                this.dialogVisible = true;
                this.title = '用户新增'
            },
            handleEdit(scope) {
                this.form = {...scope,Endtime:new Date(scope.Endtime.time),Starttime:new Date(scope.Starttime.time)}
                this.dialogVisible = true
                this.title = '用户修改'
            },
            handleDetail(scope) {
                CreateLicense(scope.Id).then(res => {
                    const ele = document.createElement('a');
                    ele.setAttribute('href', `${this.baseUrl}doc${res.filepath}`); //设置下载文件的url地址
                    ele.click();
                })
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
            getCompany() {
                getCompany().then(res => {
                    this.dict.company = res.Data;
                })
            },
            getUser() {
                getUser().then(res => {
                    this.dict.user = res.Data;
                })
            },
            getList() {
                get({...this.listQuery, ...this.paging, Role: 'cuser'}).then(res => {
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
