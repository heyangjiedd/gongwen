<template>
    <div class="app-container">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span>最近编辑</span>
                <el-upload
                        style="float: right;"
                        :limit="1"
                        :file-list="fileList"
                        name="files"
                        :on-success="success"
                        action="http://47.108.65.129:8020/v1/upload/">
                    <el-button size="small" type="danger">上传公文</el-button>
                </el-upload>
            </div>
            <div class="list-item" v-if="list.length > 0" @click="handleDetail(list[0])">
                <span>{{list[0].Name}}</span>
                <span style="margin-left: 10px">{{list[0].Createtime&&list[0].Createtime.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </div>
        </el-card>
        <el-card shadow="hover" style="margin-top: 20px">
            <div slot="header" class="clearfix">
                <span style="margin-right: 20px;">已编辑公文</span>
                <el-button style="" size="small" type="danger">一键导出</el-button>
                <el-upload
                        style="display: inline-block"
                        :limit="1"
                        :file-list="fileList"
                        name="files"
                        :on-success="success"
                        action="http://47.108.65.129:8020/v1/upload/">
                    <el-button size="small" type="danger">一键导入</el-button>
                </el-upload>
                <el-input
                        style="float: right;width: 200px"
                        placeholder="请输入搜索关键字"
                        size="small"
                        v-model="listQuery.keyWords">
                    <i slot="suffix" @click="getList" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <el-table
                    :data="list"
                    @row-click="handleDetail"
                    row-class-name="table-item"
                    cell-class-name="table-cell-item"
                    style="width: 100%">
                <el-table-column label="操作时间" prop="time" min-width="40">
                    <template slot-scope="{row}">
                        {{row.Createtime&&row.Createtime.time | parseTime('{y}-{m}-{d} {h}:{i}')}}
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="Name" min-width="80"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="{row}">
                        <el-button type="text" size="mini" @click.stop="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-popover
                                placement="top"
                                width="200"
                                v-model="row.visible">
                            <p>删除后系统将无法查阅到该文件，确定删除？</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="danger" @click.stop="row.visible = false">取消</el-button>
                                <el-button size="mini" type="danger" @click.stop="handleRemove(row)">确定</el-button>
                            </div>
                            <el-button type="text" size="mini" slot="reference" @click.stop>删除</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :background="false" v-show="paging.total>0" :total="paging.total" :page.sync="paging.start"
                        :pageSizes="[5, 10, 20, 50]" :limit.sync="paging.pagesize" @pagination="getList"/>
        </el-card>
    </div>
</template>

<script>
  import { get, add, update, remove } from '@/api/doc'
  import { get as getTemplate } from '@/api/doctemplate'
  import Pagination from '@/components/Pagination'

  export default {
    components: { Pagination },
    data() {
      return {
        listQuery: {},
        fileList: [],
        list: [],
        paging: {
          total: 0,
          start: 1,
          pagesize: 5
        }
      }
    },
    created() {
      this.getList()
    },
    mounted() {

    },
    methods: {
      handleDetail(scope) {
        this.$router.push({path:'/home/detail',query:{id:scope.id}})
      },
      handleEdit(scope) {
        this.$router.push({path:'/home/detail',query:{id:scope.id}})
      },
      handleRemove(data) {
        remove(data.Id).then(() => {
          this.$message.success('操作成功')
          this.getList()
        })
      },
      success(data) {
        this.$message.success(data.msg)
      },
      onSubmit() {
        this.$message('submit!')
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      getList() {
        get({ ...this.listQuery, ...this.paging }).then(res => {
          this.list = res.Data
          this.paging.total = res.Recordsfiltered
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

    .list-item {
        font-size: 12px;
        color: #808080;
        &:hover{
            cursor: pointer;
            color: #c00000;
        }
    }

    /deep/ .el-card__header {
        border: none;
    }
</style>

