<template>
  <div class="app-container">
    <el-row>
      <el-button style="float: right;" size="small" type="danger" @click="_downloadCommon">
        导出词库
      </el-button>
      <el-upload
        style="float: right;margin-right: 10px"
        :limit="1"
        name="files"
        :show-file-list="false"
        :on-success="_success"
        :on-progress="_progress"
        :before-upload="_before"
        :http-request="_request"
        action="">
        <el-button size="small" type="danger">导入词库</el-button>
      </el-upload>
      <el-button style="float: right;margin-right: 10px;margin-left: 10px" size="small" type="danger"
                 @click="handleAdd">新建词库类目
      </el-button>
      <el-input
        style="float: right;width: 200px"
        placeholder="请输入搜索关键字"
        size="small"
        @keydown.enter.native="goSearch"
        v-model="listQuery.keyWords">
        <i slot="suffix" @click="goSearch" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-row>
    <el-row>
      <el-col :xs="8" :lg="6" v-for="(item,index) in list" :key="index" class="card-hover">
        <el-card shadow="hover" style="margin: 20px 10px 0 10px ">
          <div slot="header" @click="goList(item)" class="clearfix">
            <span class="title-hover">{{item.Name}}</span>
            <el-popover
              placement="right"
              width="400"
              v-model="item.visible">
              <el-input v-model="item.NameCopy" size="mini" @keydown.enter.native="handleEdit(item)"
                        clearable></el-input>
              <div style="text-align: right; margin-top: 10px">
                <el-button size="mini" type="danger" @click.stop="handleEdit(item)">确认修改</el-button>
                <el-button size="mini" type="danger" @click.stop="handleRemove(item)">删除</el-button>
              </div>
              <el-button type="text" style="float: right" size="mini" slot="reference"
                         @click.stop="item.NameCopy = item.Name">操作
              </el-button>
            </el-popover>
          </div>
          <el-row>
            <el-col :span="11">
              <ul class="index-ul">
                <li class="index-li" v-if="item.children&&item.children.length>0" @click="goListIndex(r.Name)"
                    :title="r.Name" v-for="(r,n) in item.children.slice(0,6)">
                  {{r.Name}}
                </li>
              </ul>
            </el-col>
            <el-col :span="11" :offset="1">
              <ul class="index-ul">
                <li class="index-li" v-if="item.children&&item.children.length>0" @click="goListIndex(r.Name)"
                    :title="r.Name" v-for="(r,n) in item.children.slice(6,12)">
                  {{r.Name}}
                </li>
              </ul>
            </el-col>
          </el-row>

          <div style="text-align: right;font-size: 12px" v-if="item.children&&item.children.length>0">更新于 {{new
            Date(item.Updatetime.time) | parseTime('{y}-{m}-{d} {h}:{i}')}}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <pagination :background="false" v-show="paging.total>0" :total="paging.total" :page.sync="paging.start"
                  :pageSizes="[8, 16, 32, 64]" :limit.sync="paging.pagesize" @pagination="getList"/>
    </el-row>
    <el-dialog :title="title" :visible.sync="dialogVisible" @close="()=>restForm('form','form')">
      <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="100px">
        <el-row>
          <el-col :md="24" :lg="24">
            <el-form-item label="词库名称" prop="Name">
              <el-input placeholder="请输入词库名称" @keyup.enter.native="sure" v-model="form.Name" clearable>
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
  import {get as wordGet, add as wordAdd, update as wordUpdate, remove as wordRemove} from '@/api/word'
  import Pagination from '@/components/Pagination'
  import {exportDataBaser, updateDataBaser} from '@/api/fileupload'

  export default {
    components: {Pagination},
    data() {
      return {
        dialogVisible: false,
        listQuery: {},
        title: '',
        fileList: [],
        form: {},
        list: [],
        paging: {
          total: 0,
          start: 1,
          pagesize: 8
        },
        rules: {
          Name: [{required: true, message: '请填写词库名称', trigger: 'blur'}],
        }
      }
    },
    created() {
      this.getList()
    },
    mounted() {

    },
    methods: {
      handleAdd() {
        this.form = {...this.form}
        this.dialogVisible = true
        this.title = '词库新增'
      },
      goSearch() {
        this.$router.push({ path: '/thesaurus/search', query: { keyWords: this.listQuery.keyWords } })
      },
      goListIndex(keyWords){
        this.$router.push({path: '/thesaurus/search', query: {keyWords: keyWords}})
      },
      goList(item) {
        this.$router.push({ path: '/thesaurus/list', query: { Id: item.Id } })
      },
      handleRemove(data) {
        if(data.children&&data.children.length>0){
          this.$alert('删除类目前，请确保类目下无任何词。','提示',{type: 'warning',}
          );
        }else{
          this.$confirm('此操作不可逆，请谨慎操作，确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            callback: (res) => {
              if (res == 'confirm') {
                remove(data.Id).then(() => {
                  this.$message.success('操作成功')
                  this.getList()
                })
              }
            }
          })
        }
      },
      handleEdit(data) {
        update({...data, Name: data.NameCopy, updatetime: undefined}).then(() => {
          this.$message.success('操作成功')
          this.getList()
        })
      }
      ,
      success(data) {
        this.$message.success(data.msg)
      }
      ,
      sure() {
        add({...this.form, Scope: -1,}).then(res => {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.getList()
        })
      }
      ,
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      }
      ,
      getList() {
        wordGet({Scope: -1, Status: 1, Uid: this.userInfo.id}).then(res => {
          get({...this.paging, Scope: -1, Uid: this.userInfo.id}).then(resp => {
            this.paging.total = resp.Recordsfiltered
            this.list = resp.Data.map(item => {
              let data = res.Data.filter(r => r.Cateid == item.Id)
              return {...item, children: data, NameCopy: ''}
            })
          })
        })
      }
      ,
      handleFilter() {
        this.listQuery = {}
        this.getList()
      }
      ,
      downloadCommon() {
        exportDataBaser(2).then(res => {
          const ele = document.createElement('a');
          ele.setAttribute('href', `${this.baseUrl}doc/database/yilongowen_database_back.sql`); //设置下载文件的url地址
          ele.click();
        })
      }
      ,
      uploadCommon() {
        updateDataBaser().then(res => {
          this.$message.success('导出成功')
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-icon-search {
    cursor: pointer;
  }

  .card-hover {
    .index-ul {
      height: 230px;
      margin: 0;
      padding: 0;
      color: #3A3A3A;
      padding-left: 18px;
      font-size: 14px;
      word-break: break-all;
      overflow: hidden;
      .index-li {
        overflow: hidden;
        padding: 10px 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:hover {
          color: #c00000;
        }
      }
    }
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

