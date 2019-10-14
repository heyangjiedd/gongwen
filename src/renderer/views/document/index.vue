<template>
  <div class="app-container">
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>最近编辑</span>
        <el-upload
          style="float: right;margin-left: 20px"
          :limit="1"
          :file-list="fileList"
          name="files"
          :show-file-list="false"
          :on-success="success"
          :on-progress="progress"
          :data="{Cateid}"
          :before-upload="before"
          :http-request="request"
          accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          action="">
          <el-button size="small" type="danger">上传公文</el-button>
        </el-upload>
        <!--<el-select-->
        <!--v-model="Cateid"-->
        <!--filterable-->
        <!--clearable-->
        <!--size="small"-->
        <!--style="width:200px;float: right;"-->
        <!--placeholder="上传前请先选择公文模板"-->
        <!--&gt;-->
        <!--<el-option v-for="item in categoryDoc" :key="item.id" :value="item.id" :label="item.docTypeName"/>-->
        <!--</el-select>-->
      </div>
      <div class="list-item" v-if="current.Updatetime" @click="handleDetail(current)">
        <span>{{current.Name}}</span>
        <span style="margin-left: 20px">{{current.Updatetime && current.Updatetime.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        <span style="margin-left: 20px">{{current.Type === '函' ? '信函式' : '文件式'}}</span>
      </div>
    </el-card>
    <el-card shadow="hover" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span style="margin-right: 20px;">已编辑公文</span>
        <!--<el-button style="" size="small" type="danger">一键导出</el-button>-->
        <!--<el-upload-->
        <!--style="display: inline-block"-->
        <!--:limit="1"-->
        <!--:file-list="fileList"-->
        <!--name="files"-->
        <!--:on-success="success"-->
        <!--:on-progress="progress"-->
        <!--:action="baseUrl+'/upload/'">-->
        <!--<el-button size="small" type="danger">一键导入</el-button>-->
        <!--</el-upload>-->
        <el-input
          style="float: right;width: 200px"
          placeholder="请输入搜索关键字"
          size="small"
          @keydown.enter.native="getList"
          v-model="listQuery.Name">
          <i slot="suffix" @click="getList" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-table
        :data="list"
        @row-click="handleDetail"
        row-class-name="table-item"
        cell-class-name="table-cell-item"
        style="width: 100%">
        <el-table-column label="操作时间" prop="Updatetime" width="150">
          <template slot-scope="{row}">
            {{row.Updatetime&&row.Updatetime.time | parseTime('{y}-{m}-{d} {h}:{i}')}}
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="Name" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column label="公文格式" show-overflow-tooltip prop="Role" width="120">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.Type==='函'">信函式</el-tag>
            <el-tag type="warning" v-else>文件式</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click.stop="handleEdit(row)">
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
              <el-button type="danger" size="mini" slot="reference" @click.stop>删除</el-button>
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
  import {get, add, update, remove, getCateDocList} from '@/api/doc'
  import {upload} from '@/api/fileupload'
  import {get as getTemplate} from '@/api/doctemplate'
  import Pagination from '@/components/Pagination'
  import {Loading, MessageBox} from 'element-ui'

  export default {
    components: {Pagination},
    data() {
      return {
        categoryDoc: [],
        Cateid: '',
        listQuery: {},
        fileList: [],
        list: [],
        current: {},
        paging: {
          total: 0,
          start: 1,
          pagesize: 5
        }
      }
    },
    created() {
      this.getList();
      // this.getTemplate();
    },
    mounted() {

    },
    methods: {
      request(data) {
        var form = new FormData();
        console.log(this.Cateid)
        form.append("Cateid", this.Cateid);
        form.append("files", data.file);
        upload(form).then(res => {
          this.$message.success('操作成功')
          this.handleEdit(res);
        })
      },
      handleDetail(scope) {
        this.$router.push({path: '/home/detail', query: {id: scope.Id, path: scope.Path,name: scope.Name, ext: scope.Ext}})
      },
      handleEdit(scope) {
        this.$router.push({
          path: '/home/edit', query: {
            id: scope.Id || scope.id,
            path: (scope.Path || scope.path),
            ext: (scope.Ext || scope.ext),
            name: (scope.Name || scope.name),
          }
        })
      },
      handleRemove(data) {
        remove(data.Id).then(() => {
          this.$message.success('操作成功')
          this.getList()
        })
      },
      progress(event, file, fileList) {
        this.loadingInstance = this.loadingInstance || Loading.service({
          text: '请求中',
          background: 'rgba(0, 0, 0, 0.28)'
        });
      },
      success(data) {
        this.loadingInstance.close();
        if (data.code === 50008 || data.code === 50012 || data.code === 50014) {
          // to re-login
          MessageBox.confirm('你已被登出，可以取消留在该页面，或者重新登录。', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$store.dispatch('user/resetToken').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          })
          return
        }
        this.$message.success(data.message);
        let path = `${data.filesurl[0].split('.')[0]}`
        this.$router.push({path: '/home/edit', query: {path: path}})
      },
      before(file) {
        const isJPG = /.(docx|doc)$/.test(file.name);
        if (!isJPG) {
          this.$message.error('上传word文档!')
        }
        // if (!this.Cateid) {
        //   this.$message.error('请先选择公文类型!');
        //   return false;
        // }
        return isJPG
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
      getTemplate() {
        getCateDocList().then(res => {
          this.categoryDoc = res.info || []
        })
      },
      getList() {
        get({...this.listQuery, ...this.paging}).then(res => {
          this.list = res.Data
          this.paging.total = res.Recordsfiltered
        });
        get({start: 1, pagesize: 1}).then(res => {
          this.current = res.Data[0]||{}
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
  .el-icon-search {
    cursor: pointer;
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

  .list-item {
    font-size: 12px;
    color: #808080;
    &:hover {
      cursor: pointer;
      color: #c00000;
    }
  }

  /deep/ .el-card__header {
    border: none;
  }
</style>

