<template>
    <div class="app-container">
        <el-row>
            <el-button style="float: left;" size="small" type="danger" @click.stop="$router.go(-1)"><i
                    class="el-icon-arrow-left el-icon--left"/>返回
            </el-button>
            <el-button style="float: right;" size="small" type="danger" @click="_downloadCommon">
                一键导出词库
            </el-button>
            <el-upload
                    style="float: right;"
                    :limit="1"
                    name="files"
                    :show-file-list="false"
                    :on-success="_success"
                    :on-progress="_progress"
                    :before-upload="_before"
                    :http-request="_request"
                    action="">
                <el-button size="small" type="danger">一键导入词库</el-button>
            </el-upload>
            <el-button style="float: right;margin-right: 10px;margin-left: 10px" size="small" type="danger"
                       @click="handleAdd">新建词库类目
            </el-button>
            <el-input
                    style="float: right;width: 200px"
                    placeholder="请输入搜索关键字"
                    size="small"
                    @keydown.enter.native="getWords"
                    v-model="listQuery.Name">
                <i slot="suffix" @click="getWords" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-select
                    v-model="listQuery.Cateid"
                    filterable
                    clearable
                    size="small"
                    @change="getWords"
                    style="width:200px;float: right;margin-right: 10px"
                    placeholder="输入或选择词库类目"
            >
                <el-option v-for="item in list" :key="item.Id" :value="item.Id" :label="item.Name"/>
            </el-select>
        </el-row>
        <el-card shadow="hover" style="margin-top:20px">
            <el-table
                    :data="listWords"
                    row-class-name="table-item"
                    cell-class-name="table-cell-item"
                    style="width: 100%">
                <el-table-column label="错词" prop="Name" min-width="80">
                    <template slot-scope="{row}">
                        <el-popover
                                placement="right"
                                width="400"
                                v-model="row.visible">
                            <el-form label-position="left" label-width="100px">
                                <el-row>
                                    <el-col :md="24" :lg="24">
                                        <el-form-item style="margin-bottom: 0" label="错词" prop="Name">
                                            <el-input v-model="row.NameCopy" size="mini" type="input"
                                                      clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :md="24" :lg="24">
                                        <el-form-item style="margin-bottom: 10px" label="正确词" prop="coorectName">
                                            <TagList v-model="row.CoorectNameCopy"></TagList>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div style="text-align: right;">
                                <el-button size="mini" type="danger" @click.stop="handleEdit(row)">确认修改</el-button>
                                <el-button size="mini" type="danger" @click.stop="handleRemove(row)">删除</el-button>
                                <el-popover
                                        placement="right"
                                        trigger="hover"
                                        v-model="row.visibleCopy"
                                        width="200">
                                    <div v-for="(item,index) in list" class="list-item-hover" :key="index"
                                         @click="handleMove(row,item)">{{item.Name}}
                                    </div>
                                    <el-button slot="reference" size="mini" type="danger" @click.stop>类目变更<i
                                            class="el-icon-arrow-right el-icon--right"/></el-button>
                                </el-popover>
                            </div>
                            <el-button type="text" size="medium" slot="reference"
                                       @click.stop="row.NameCopy = row.Name;row.CoorectNameCopy = row.CoorectName">
                                {{row.Name}}
                            </el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="正确词" prop="CoorectName" min-width="100">
                    <template slot-scope="{row}">
                        <el-popover
                                placement="right"
                                width="400"
                                v-model="row.visible1">
                            <el-form label-position="left" label-width="100px">
                                <el-row>
                                    <el-col :md="24" :lg="24">
                                        <el-form-item style="margin-bottom: 0" label="错词" prop="Name">
                                            <el-input v-model="row.NameCopy" size="mini" type="input"
                                                      clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :md="24" :lg="24">
                                        <el-form-item style="margin-bottom: 10px" label="正确词" prop="coorectName">
                                            <TagList v-model="row.CoorectNameCopy"></TagList>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div style="text-align: right;">
                                <el-button size="mini" type="danger" @click.stop="handleEdit(row)">确认修改</el-button>
                                <el-button size="mini" type="danger" @click.stop="handleRemove(row)">删除</el-button>
                                <el-popover
                                        placement="right"
                                        trigger="hover"
                                        v-model="row.visibleCopy1"
                                        width="200">
                                    <div v-for="(item,index) in list" class="list-item-hover" :key="index"
                                         @click="handleMove(row,item)">
                                        {{item.Name}}
                                    </div>
                                    <el-button slot="reference" size="mini" type="danger" @click.stop>类目变更<i
                                            class="el-icon-arrow-right el-icon--right"/></el-button>
                                </el-popover>
                            </div>
                            <el-button type="text" size="medium" slot="reference"
                                       @click.stop="row.NameCopy = row.Name;row.CoorectNameCopy = row.CoorectName">
                                {{row.CoorectName}}
                            </el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="储存路径" prop="Cateid" min-width="40">
                    <template slot-scope="{row}">
                        <el-tag type="danger" v-if="row.Scope===1">公共词库</el-tag>
                        <el-tag type="success" v-else>{{row.Catename}}/私有词库</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="保存时间" prop="time" min-width="40">
                    <template slot-scope="{row}">
                        {{row.Updatetime&&row.Updatetime.time | parseTime('{y}-{m}-{d} {h}:{i}')}}
                    </template>
                </el-table-column>
            </el-table>
            <pagination :background="false" v-show="paging.total>0" :total="paging.total" :page.sync="paging.start"
                        :pageSizes="[5, 10, 20, 50]" :limit.sync="paging.pagesize" @pagination="getWords"/>
        </el-card>
        <el-dialog :title="title" :visible.sync="dialogVisible" @close="()=>restForm('form','form')">
            <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="100px">
                <el-row>
                    <el-col :md="24" :lg="24">
                        <el-form-item label="词库名称" prop="Name">
                            <el-input placeholder="请输入词库名称" v-model="form.Name" clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="sure">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {get, add, update, remove} from '@/api/category'
    import {
        get as wordGet,
        add as wordAdd,
        update as wordUpdate,
        remove as wordRemove,
        getByIdCoorectName,
        addCoorectName,
        updateCoorectName
    } from '@/api/word'
    import Pagination from '@/components/Pagination'
    import TagList from '@/components/TagList'
    import {exportDataBaser, updateDataBaser} from '@/api/fileupload'

    export default {
        components: {Pagination, TagList},
        data() {
            return {
                dialogVisible: false,
                dialogVisibleWord: false,
                listQuery: {
                    Name: this.$route.query.keyWords
                },
                title: '',
                form: {},
                formWord: {},
                list: [],
                listWords: [],
                rules: {
                    Name: [{required: true, message: '请填写词库名称', trigger: 'blur'}]
                },
                rulesWord: {
                    Name: [{required: true, message: '请填写词汇', trigger: 'blur'}]
                },
                paging: {
                    total: 0,
                    start: 1,
                    pagesize: 5
                }
            }
        },
        created() {
            this.getWords()
            this.getList()
        },
        mounted() {

        },
        methods: {
            goSearch() {
                this.$router.push({path: '/thesaurus/search', query: {keyWords: this.listQuery.keyWords}})
            },
            handleClick() {
                this.paging.start = 1
                this.getWords()
            },
            handleAddWord() {
                this.formWord = {...this.formWord}
                this.dialogVisibleWord = true
                this.title = '词汇新增'
            },
            handleAdd() {
                this.form = {...this.form}
                this.dialogVisible = true
                this.title = '词库新增'
            },
            handleDetail(scope) {
                this.$router.push({path: '/home/detail', query: {id: scope.id}})
            },
            handleEdit(data) {
                wordUpdate({
                    ...data,
                    Name: data.NameCopy,
                    CoorectName: data.CoorectNameCopy,
                    updatetime: undefined
                }).then(() => {
                    this.$message.success('操作成功')
                    this.getWords()
                })
            },
            handleMove(row, item) {
                wordUpdate({...row, Cateid: item.Id, updatetime: undefined}).then(() => {
                    this.$message.success('操作成功')
                    this.getWords()
                })
            },
            handleRemove(data) {
                wordUpdate({...data, status: -1, updatetime: undefined}).then(() => {
                    this.$message.success('操作成功')
                    this.getWords()
                })
            },
            success(data) {
                this.$message.success(data.msg)
            },
            sure() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        add({...this.form, Scope: -1}).then(res => {
                            this.$message.success('操作成功')
                            this.dialogVisible = false
                            this.getList()
                        })
                    }
                })
            },
            sureWord() {
                this.$refs['formWord'].validate((valid) => {
                    if (valid) {
                        wordAdd({...this.form, Scope: -1, Cateid: this.activeName}).then(res => {
                            this.$message.success('操作成功')
                            this.dialogVisibleWord = false
                            this.getWords()
                        })
                    }
                })
            },
            onCancel() {
                this.$message({
                    message: 'cancel!',
                    type: 'warning'
                })
            },
            getWords() {
                wordGet({...this.listQuery, ...this.paging, Scope: -1, Status: 1,Uid:this.userInfo.id}).then(res => {
                    this.listWords = res.Data.map(item => ({...item, NameCopy: '', CoorectNameCopy: ''}))
                    this.paging.total = res.Recordsfiltered
                })
            },
            getList() {
                get({Scope: -1,Uid:this.userInfo.id}).then(res => {
                    this.list = res.Data.map(item => {
                        return {...item, Id: '' + item.Id}
                    })
                })
            },
            handleFilter() {
                this.listQuery = {}
                this.getList()
            },
            downloadCommon() {
                exportDataBaser().then(res => {
                    const ele = document.createElement('a')
                    ele.setAttribute('href', `${this.baseUrl}doc/database/yilongowen_database_back.sql`) //设置下载文件的url地址
                    ele.click()
                })
            },
            uploadCommon() {
                updateDataBaser().then(res => {
                    this.$message.success('导出成功')
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .list-item-hover {
        height: 32px;
        line-height: 32px;
        padding: 0 5px;
        border-radius: 3px;

        &:hover {
            background: #c00000;
            color: white;
            cursor: pointer;
        }
    }

    /deep/ .table-item {
        cursor: pointer;

        &:hover {
            color: #c00000 !important;

            .el-button--text {
                color: #c00000 !important;
            }
        }
    }

    /deep/ .el-table::before {
        height: 0;
    }

    /deep/ .has-gutter th {
        border: none;
    }

    /deep/ .table-cell-item {
        border: none;
    }

    /deep/ .el-card__header {
        padding-bottom: 0;
        border: none;
    }

    /deep/ .is-active {
        background: #c00000;
        color: white !important;
    }

    /deep/ .el-tabs__item {
        &:hover {
            color: #3A3A3A;
        }
    }

    /deep/ .el-tabs__header {
        border: none !important;
    }

    /deep/ .el-tabs__nav {
        border: none !important;
    }

    .card-hover {
        &:hover {
            cursor: pointer;

            .title-hover {
                color: #c00000;
            }
        }
    }

    .list-item {
        font-size: 12px;
        color: #808080;
    }
</style>

